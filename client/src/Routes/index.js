import React from "react";

const overview = React.lazy(()=> import('../app/OverView/Index'))
 
const RouteList = [
    {path: "/", component: overview}
]


export default RouteList;