import { UserModel } from "../modal/users.js";
import mongoose from "mongoose";
import { AllNotification } from "../modal/NotificationSchema.js";
import { MessageStorage } from "../modal/MessageSchema.js";
import { sendEmail } from "../utils/sendEmail.js"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const getUserDetailLogin = async (req, res) => {

    try {
        let id = new mongoose.Types.ObjectId(req?.query?.Id);
        let matchstages = []
        matchstages.push({ $match: { _id: id } })

        let UserDetail = await UserModel.aggregate(matchstages)
        res.status(200).json({ Detail: UserDetail })



    } catch (err) {

    }


}
const getUserDetails = async (req, res) => {
    try {
        let id
        // = req?.query?.Id||req?.user?.id;
        // console.log('id is',typeof req?.query?.Id)
        if (req?.query?.Id == 'null') {
            id = new mongoose.Types.ObjectId(req?.user?.id);

        } else {
            // id = req?.query?.Id
            id = new mongoose.Types.ObjectId(req?.query?.Id);

        }
        // let UserDetail;
        let matchstages = []
        if (req?.query?.Id != 'null') {
            matchstages.push({ $match: { _id: id } })
            matchstages.push({
                $project: {
                    username: 1,
                    planName: 1,
                    ActiveWorkoutPlan: 1,
                    WorkoutHistory: 1,
                    LoginCount: 1,
                    friendsCount: {
                        $size: { $ifNull: ["$Friends", []] }
                    },
                    exists: {
                        $in: [
                            { $toObjectId: req.user.id },
                            { $ifNull: ["$Friends", []] }
                        ]
                    },
                    FriendRequest: {
                        $in: [
                            { $toObjectId: req.user.id },
                            { $ifNull: ["$FriendRequest", []] }
                        ]
                    },
                    isPremium: 1

                }
            });





        } else {
            matchstages.push({ $match: { _id: id } })

        }
        let UserDetail = await UserModel.aggregate(matchstages)

        res.status(200).json({ Detail: UserDetail })


    } catch (err) {
        console.log('getUserDetails', err)


    }

}

const AddFriendUser = async (req, res) => {
    console.log('add friend api', req.body?.userId)
    try {

        let ReciverUser = await UserModel.findOne({ _id: req.body?.userId })
        let Sender = await UserModel.findOne({ _id: req?.user?.id })
        console.log('Sender', Sender?.username)
        console.log('Reciver', ReciverUser?.username)

        if (ReciverUser && ReciverUser?.accounttype == 'public') {
            console.log('public acc query')
            let ReciverResult = await UserModel.findOneAndUpdate({ _id: req.body?.userId }, { $addToSet: { Friends: req?.user?.id } })
            let SenderResult = await UserModel.findOneAndUpdate({ _id: req?.user?.id }, { $addToSet: { Friends: ReciverUser?._id } })

            let NotifyReciver = new AllNotification({
                userId: req.body?.userId,
                username: ReciverUser?.username,
                senderId: req?.user?.id,
                ReciverUser: ReciverUser?.username,
                senderUserName: Sender?.username,
                type: 'follow',
                message: `${Sender?.username} started following you`,
                isRead: false
            })
            let NotifySender = new AllNotification({
                userId: req?.user?.id,
                username: Sender?.username,

                senderId: req?.body?.userId,
                ReciverUser: Sender?.username,
                senderUserName: ReciverUser?.username,
                type: 'follow',
                message: `you started following ${ReciverUser?.username}`,
                isRead: false

            })
            await NotifyReciver.save()
            await NotifySender.save()
            // console.log(Result)

        } else {
            console.log('private acc query')

        }
        res.status(200).json({ message: ReciverUser })

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: err })

    }
}

const GetAllFriendRequest = async (req, res) => {
    try {


    } catch (err) {
        res.status(500).json({ message: err })
    }
}
const GetUserFeed = async (req, res) => {
    try {
        // console.log('GetUserFeed', req?.user?._id)
        // console.log(result=',await UserModel.find({}, { username: 1, accounttype: 1 }));

        const currentUser = await UserModel.findOne({ _id: req?.user?.id });
        console.log('currentUser', currentUser?._id)

        if (!currentUser) {
            return res.status(404).json({ message: "User not found" });
        }

        let Result = await UserModel.aggregate([
            {
                $match: {
                    $and: [
                        // exclude yourself
                        { _id: { $ne: currentUser._id } },
                        {
                            $or: [
                                { accounttype: "public" },
                                { accounttype: { $exists: false } },        // old users
                                { _id: { $in: currentUser?.Friends || [] } }
                            ]
                        },

                    ]
                }
            },
            {
                $project: {

                    username: 1,

                }
            }

        ]);

        console.log('Result', Result)
        res.status(200).json({ Result })


    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Server Side Error', err })

    }
}

const UserNotification = async (req, res) => {
    try {
        console.log('UserNotification')
        let user = await UserModel.findOne({ _id: req?.user?.id })


        let Result = await AllNotification.aggregate([
            { $match: { username: user?.username } },
            {
                $project: {
                    _id: 1,
                    userId: 1,
                    username: 1,
                    senderId: 1,
                    senderUserName: 1,
                    type: 1,
                    message: 1,
                    isRead: 1,
                    createdAt: 1
                }
            }
        ])

        console.log('Result', Result)
        res.status(200).json({ msg: Result })

    } catch (err) {
        console.log(err)
        res.status(500).json({ Err: err })
    }

}

const GetAllUserConversation = async (req, res) => {
    try {
        function createConversationId(user1, user2) {
            return [user1, user2].sort().join("_");
        }
        let { UserId, OtherUserId } = req?.query;
        let ConversationId = createConversationId(UserId, OtherUserId)
        let result = await MessageStorage.aggregate([
            { $match: { conversationId: ConversationId } },
            { $sort: { createdAt: 1 } },
            {
                $lookup: {
                    from: "messages",

                    localField: "RepliedToUniqueMessageId",
                    foreignField: "UniqueMessageId",
                    as: "replyMessage"
                }
            }
            ,

            {
                $unwind: {
                    path: "$replyMessage",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    senderId: 1,
                    receiverId: 1,
                    message: 1,

                    messageType: 1,

                    SenderUsername: 1,

                    ReciverUsername: 1,

                    isRead: 1,

                    conversationId: 1,

                    time: 1,

                    date: 1,

                    isDeleted: 1,
                    replyTo: 1,
                    replyMessage: 1,
                    RepliedToImage: 1,
                    ImageUrl: 1,
                    UniqueMessageId: 1,
                    RepliedToUniqueMessageId: 1


                }
            }

        ])
        res.status(200).json({ result: result })
    } catch (err) {
        console.log(err)
        res.status(500).json({ Err: err })

    }
}
const GetReplyMessage = async (req, res) => {
    res.status(200).json({ message: 'Reply' })
}
const HandleDeleteMessage = async (req, res) => {
    try {
        console.log('HandleDeleteMessage', req?.body?.userId)
        let Result = await MessageStorage.findByIdAndUpdate({ _id: req?.body?.userId }, { $set: { isDeleted: true } })
        console.log('Result', Result)

        res.status(200).json({ msg: 'msg deleted success fully', Result: Result })
    } catch (err) {
        res.status(500).json({ Err: err })


    }

}
const UpdatePassword = async (req, res) => {
    try {
        console.log("UpdatePassword", generateOTP())
        let { username, email } = req?.body;
        let UserExists = await UserModel.findOne({ username: username.trim(), email: email.trim() });
        if (!UserExists) {

            res.status(401).json({ message: 'Enter Valid Username and email!' })

        }
        let Otp = generateOTP();
        // let Date=new Date(Date.now() + 5 * 60 * 1000);
        UserExists.Otp = Otp;
        UserExists.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
        await UserExists.save()
        await sendEmail(email, "Reset Password Otp", `<h4>Otp : ${Otp}</h4>`)



        res.status(200).json({ message: "Otp Sent to your registered email" })



    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Server side error' })


    }
}
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

const VerifyOtp = async (req, res) => {
    console.log("req.body", req?.body)
    try {
        let { otp,
            Username,
            Email } = req?.body;
        if (!otp || !Username || !Email) return res.status(400).json({ message: 'Something went wrong' })
        let User = await UserModel.findOne({ username: Username })
        if (User?.Otp == otp) {
            return res.status(200).json({ message: 'Verified' })
        } else {
            return res.status(400).json({ message: "You entered wrong otp!" })
        }

    } catch (err) {
        return res.status(500).json({ message: "Internal server error" })

    }

}
const HandlePasswordChange = async (req, res) => {
    try {
        // HandlePasswordChange
        console.log("req.body", req?.body)
        let { oldpassword,
            newpassword,
            confirmnewpassword } = req.body;

        const user = await UserModel.findOne({ _id: req?.user?.id });

        if (!user) return res.status(400).json({ message: "Invalid email or password" });



        if (oldpassword.trim() == "" || newpassword.trim() == "" || confirmnewpassword.trim() == "") {
            res.status(400).json({ message: 'All fields are required' })
        }
        if (newpassword.trim() != confirmnewpassword.trim()) {
            res.status(400).json({ message: 'Password does not match !' })

        }
        const validPassword = await bcrypt.compare(oldpassword, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: "You Entered wrong password!" })
        }
        const hashedPassword = await bcrypt.hash(newpassword.trim(), 10);
        user.password=hashedPassword;
        await user.save();
            res.status(200).json({ message: "Password changed successfully!" })

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "server side error!" })
    }
}
const UploadImage = async (req, res) => {


    console.log('upload image')
    res.json({ UploadImage: req.file.path })
}
export { HandlePasswordChange, VerifyOtp, getUserDetailLogin, UpdatePassword, UploadImage, GetReplyMessage, HandleDeleteMessage, UserNotification, getUserDetails, GetUserFeed, AddFriendUser, GetAllFriendRequest, GetAllUserConversation }