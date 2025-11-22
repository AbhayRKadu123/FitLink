import { UserModel } from "../modal/users.js";
import mongoose from "mongoose";
import { AllNotification } from "../modal/NotificationSchema.js";
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
                    }
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
        console.log('Sender',Sender?.username)
        console.log('Reciver',ReciverUser?.username)

        if (ReciverUser && ReciverUser?.accounttype == 'public') {
            console.log('public acc query')
            let ReciverResult = await UserModel.findOneAndUpdate({ _id: req.body?.userId }, { $addToSet: { Friends: req?.user?.id } })
            let SenderResult = await UserModel.findOneAndUpdate({ _id: req?.user?.id }, { $addToSet: { Friends: ReciverUser?._id } })
            
            let NotifyReciver = new AllNotification({
                userId: req.body?.userId,
                senderId: req?.user?.id,
                ReciverUser: ReciverUser?.username,
                senderUserName: Sender?.username,
                type: 'follow',
                message: `${Sender?.username} started following you`,
                isRead: false
            })
            let NotifySender = new AllNotification({
                userId: req?.user?.id,
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

}
export { getUserDetails, GetUserFeed, AddFriendUser, GetAllFriendRequest }