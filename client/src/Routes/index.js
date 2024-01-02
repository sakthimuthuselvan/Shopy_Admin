import React from "react";

const overview = React.lazy(()=> import('../OverView/OverView'))
 
const RouteList = [
    {path: "/", component: overview}
]


export default RouteList;