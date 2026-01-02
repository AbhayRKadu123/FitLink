import express from 'express' 
import { WeightController,AddWeight,GetAllWeightGraphandDetail} from '../Controller/WeightController.js';
import { verifyToken } from '../MiddleWare/VerifyToken.js';
const WeightRouter = express.Router(); // ✅ create router instance

WeightRouter.get("/GetUserWeightGraph",verifyToken,WeightController)
WeightRouter.post("/AddWeight",verifyToken,AddWeight)
WeightRouter.get("/GetAllWeightGraphandDetail",verifyToken,GetAllWeightGraphandDetail)
// WeightRouter.get("/GetAllWeightGraphandDetail",GetAllWeightGraphandDetail)

export default WeightRouter;