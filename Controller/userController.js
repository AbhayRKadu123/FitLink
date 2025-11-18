import { UserModel } from "../modal/users.js";
const getUserDetails = async (req, res) => {
    try {
        let id = req?.user?.id;
        let UserDetail = await UserModel.findOne({ _id: id })
        res.status(200).json({ Detail: UserDetail })


    } catch (err) {

    }

    console.log('getUserDetails')
}

const GetUserFeed = async (req, res) => {
    try {
        // console.log('GetUserFeed', req?.user?._id)
        // console.log(result=',await UserModel.find({}, { username: 1, accounttype: 1 }));

        const currentUser = await UserModel.findOne({ _id: req?.user?.id });
        console.log('currentUser', currentUser)

        if (!currentUser) {
            return res.status(404).json({ message: "User not found" });
        }

        let Result = await UserModel.aggregate([
            {
                $match: {
                    $and: [
                        { username: { $ne: currentUser?.username } },  // exclude yourself
                        {
                            $or: [
                                { accounttype: "public" },
                                { accounttype: { $exists: false } },        // old users
                                { _id: { $in: currentUser?.Friends || [] } }
                            ]
                        }
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
export { getUserDetails, GetUserFeed }