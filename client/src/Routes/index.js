import React from "react";

const overview = React.lazy(()=> import('../app/OverView/Index.tsx'))
const category =React.lazy(()=> import('../app/Category/Index'))
const childCategory =React.lazy(()=> import('../app/Category/ChildCategory.tsx'))
const CardAdvertisment =React.lazy(()=> import('../app/Advertisment/CardImage.tsx'))

const RouteList = [
    {path: "/", component: overview},
    {path:"/category", component:category},
    {path:"/category/child", component:childCategory},
    {path:"/advertisment/banner", component:CardAdvertisment}

]


export default RouteList;