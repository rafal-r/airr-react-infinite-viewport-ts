import React from "react";
import { View, ViewProps } from "airr-react";
import "../../css/HelloWorld.css";

export const viewName = "hello-world-view";

interface HelloWorldViewProps extends ViewProps {
    render?: () => React.ReactNode;
}

export default class HelloWorld extends View<HelloWorldViewProps> {
    content() {
        const content =
            typeof this.props.render === "function"
                ? this.props.render()
                : typeof this.props.children === "function"
                ? this.props.children()
                : this.props.children;

        return <div className={viewName}>{content ? content : "What up!"}</div>;
    }
}
