import React from "react";
import { View, ViewsArray, ViewProps } from "airr-react";
import "../../css/CommonView.css";

export const viewNameTpl = "common-view-*";
const viewClass = "common-view";

export const getNextCommonViewName = (views: ViewsArray) => {
    return viewNameTpl.replace("*", views[views.length - 1].props.number + 1);
};

export const getNextCommonViewName2 = (views: ViewsArray) => {
    return viewNameTpl.replace("*", String(views.length + 1));
};

export const countCommonViews = (views: ViewsArray) => {
    return views.reduce((prev, curr) => {
        if (curr.type === CommonView) {
            prev += 1;
        }

        return prev;
    }, 0);
};
interface HelloWorldViewProps extends ViewProps {
    render?: () => React.ReactNode;
}
export default class CommonView extends View<HelloWorldViewProps> {
    content() {
        const content =
            typeof this.props.render === "function"
                ? this.props.render()
                : typeof this.props.children === "function"
                ? this.props.children()
                : this.props.children;

        return <div className={viewClass}>{content} </div>;
    }
}
