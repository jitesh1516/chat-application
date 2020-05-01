"use strict"

//User Endpoints
import { anonymousRoute } from "./User/anonymous.user.route";



export let Routes = []

Routes = Routes.concat(anonymousRoute);

