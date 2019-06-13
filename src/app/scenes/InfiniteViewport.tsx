import React, { SyntheticEvent } from "react";
import {
    Scene,
    Sidepanel,
    isAnimation,
    SceneProps,
    SceneState
} from "airr-react";
import HelloWorld, {
    viewName as HelloWorldViewName
} from "../views/HelloWorld";
import CommonView, {
    getNextCommonViewName,
    viewNameTpl as CommonViewNameTpl
} from "../views/CommonView";
import "../../css/InfiniteViewport.css";
import { colors } from "./colors";
import Options from "../ui/Options";
import { NavbarProp } from "airr-react/types/SceneRenderer";

interface State extends SceneState {
    showOptions: boolean;
    handleBackButtonString: string;
    handleBackButtonOnFirstViewString: string;
}
export default class InfiniteViewport extends Scene<SceneProps, State> {
    constructor(props: SceneProps) {
        super(props);

        this.state = {
            //Scene state
            ...this.state,
            navbar: 1,
            backButton: true,
            activeViewName: HelloWorldViewName,
            views: [this.getFreshViewConfig(HelloWorldViewName)],
            children: this.renderTabsMenu,
            handleBackButton: this.backButtonHandler,
            handleBackBehaviourOnFirstView: this.backBehaviourOnFirstView,
            navbarMenu: undefined,
            //Custom state
            showOptions: false,
            handleBackButtonString: "go back",
            handleBackButtonOnFirstViewString: "alert something"
        };
    }

    handleNextClick = () => {
        if (this.state.views) {
            const color = colors[Math.floor(Math.random() * colors.length)];
            const number =
                this.state.views[this.state.views.length - 1].props.number + 1;

            this.changeView(CommonViewNameTpl, {
                children: "Common view number " + number,
                title: "View number " + number,
                color,
                style: { backgroundColor: color },
                number
            });
        }
    };

    toggleOptions = () => {
        this.setState({ showOptions: !this.state.showOptions });
    };

    toggleGUIDisabled = () => {
        this.setState({ GUIDisabled: !this.state.GUIDisabled });
    };

    handleGUIDisableCoverChange = (e: SyntheticEvent<HTMLInputElement>) => {
        this.setState({ GUIDisableCover: e.currentTarget.value });
    };

    handleClassNameChange = (e: SyntheticEvent<HTMLInputElement>) => {
        this.setState({ className: e.currentTarget.value });
    };

    handleAnimationChange = (e: SyntheticEvent<HTMLSelectElement>) => {
        const val = e.currentTarget.value;
        if (isAnimation(val)) {
            this.setState({
                animation: val
            });
        }
    };

    handleAnimationTimeChange = (e: SyntheticEvent<HTMLInputElement>) => {
        this.setState({ animationTime: Number(e.currentTarget.value) });
    };

    toggleStackMode = () => {
        this.setState({ stackMode: !this.state.stackMode });
    };

    handleNavbarChange = (e: SyntheticEvent<HTMLSelectElement>) => {
        this.setState({ navbar: Number(e.currentTarget.value) as NavbarProp });
    };

    handleNavbarHeightChange = (e: SyntheticEvent<HTMLInputElement>) => {
        this.setState({ navbarHeight: Number(e.currentTarget.value) });
    };

    handleNavbarClassChange = (e: SyntheticEvent<HTMLSelectElement>) => {
        this.setState({ navbarClass: e.currentTarget.value });
    };

    handleNavbarMenuChange = (e: SyntheticEvent<HTMLSelectElement>) => {
        const hasVal = e.currentTarget.value;
        if (hasVal) {
            this.setState({
                navbarMenu: "toggleSidepanel"
            });
            this.setSidepanelConfig({
                type: Sidepanel,
                props: {
                    side: "left",
                    children: (
                        <div style={{ padding: "2rem" }}>
                            side panel content
                        </div>
                    )
                }
            });
        } else {
            this.setState({
                navbarMenu: undefined,
                sidepanel: undefined
            });
        }
    };

    toggleBackButton = () => {
        this.setState({ backButton: !this.state.backButton });
    };

    toggleBackButtonOnFirstView = () => {
        this.setState({
            backButtonOnFirstView: !this.state.backButtonOnFirstView
        });
    };

    handleBackButtonStringChange = (e: SyntheticEvent<HTMLSelectElement>) => {
        this.setState({ handleBackButtonString: e.currentTarget.value });
    };

    handleBackButtonOnFirstViewStringChange = (
        e: SyntheticEvent<HTMLSelectElement>
    ) => {
        this.setState({
            handleBackButtonOnFirstViewString: e.currentTarget.value
        });
    };

    backButtonHandler = () => {
        const what2do = this.state.handleBackButtonString;

        switch (what2do) {
            case "none":
                return;

            case "alert something":
                alert("The back button was clicked");
                return;

            case "pop view":
                {
                    if (this.state.views) {
                        const activeViewIndex = this.state.views.findIndex(
                            view =>
                                view.props.name === this.state.activeViewName
                        );
                        const lastViewName = this.state.activeViewName;
                        const nextView = this.state.views[activeViewIndex - 1];

                        if (nextView && lastViewName) {
                            this.changeView(nextView.props.name).then(() =>
                                this.destroyView(lastViewName)
                            );
                        }
                    }
                }
                break;

            case "go back":
            default:
                {
                    if (this.state.views) {
                        const activeViewIndex = this.state.views.findIndex(
                            view =>
                                view.props.name === this.state.activeViewName
                        );
                        const nextView = this.state.views[activeViewIndex - 1];

                        if (nextView) {
                            this.changeView(nextView.props.name);
                        } else {
                            console.log(
                                "You are on first view. Can't go back anymore."
                            );
                        }
                    }
                }

                break;
        }
    };

    backBehaviourOnFirstView = () => {
        const what2do = this.state.handleBackButtonOnFirstViewString;

        switch (what2do) {
            case "none":
                return;

            case "log in console":
                console.log(
                    "Handling back button click on first view in stack!"
                );
                break;
            case "alert something":
            default:
                alert("Handling back button click on first view in stack!");
                return;
        }
    };

    renderTabsMenu = ({ views }: SceneProps) => {
        return (
            <>
                <div className="button-wrap">
                    <button onClick={this.toggleOptions}>
                        {this.state.showOptions ? "close" : "show"} options
                    </button>
                </div>
                <nav className="infinite-viewport-nav">
                    <div className="views-links">
                        {views && views.map(item => (
                            <span
                                style={item.props.style}
                                key={item.props.name}
                                onClick={() => {
                                    this.changeView(item.props.name);
                                }}
                                className={
                                    this.state.activeViewName ===
                                    item.props.name
                                        ? "active"
                                        : ""
                                }
                            >
                                {item.props.number}
                            </span>
                        ))}
                    </div>
                    <button className="add-new" onClick={this.handleNextClick}>
                        push new
                    </button>
                </nav>
                {this.state.showOptions && (
                    <Options
                        toggleOptions={this.toggleOptions}
                        GUIDisabled={this.state.GUIDisabled}
                        toggleGUIDisabled={this.toggleGUIDisabled}
                        GUIDisableCover={this.state.GUIDisableCover}
                        handleGUIDisableCoverChange={
                            this.handleGUIDisableCoverChange
                        }
                        className={this.state.className}
                        handleClassNameChange={this.handleClassNameChange}
                        animation={this.state.animation}
                        handleAnimationChange={this.handleAnimationChange}
                        animationTime={this.state.animationTime}
                        handleAnimationTimeChange={
                            this.handleAnimationTimeChange
                        }
                        toggleStackMode={this.toggleStackMode}
                        stackMode={this.state.stackMode}
                        navbar={this.state.navbar}
                        handleNavbarChange={this.handleNavbarChange}
                        navbarMenu={this.state.navbarMenu}
                        handleNavbarMenuChange={this.handleNavbarMenuChange}
                        navbarHeight={this.state.navbarHeight}
                        handleNavbarHeightChange={this.handleNavbarHeightChange}
                        navbarClass={this.state.navbarClass}
                        handleNavbarClassChange={this.handleNavbarClassChange}
                        toggleBackButton={this.toggleBackButton}
                        backButton={this.state.backButton}
                        toggleBackButtonOnFirstView={
                            this.toggleBackButtonOnFirstView
                        }
                        backButtonOnFirstView={this.state.backButtonOnFirstView}
                        handleBackButtonString={
                            this.state.handleBackButtonString
                        }
                        handleBackButtonStringChange={
                            this.handleBackButtonStringChange
                        }
                        handleBackButtonOnFirstViewString={
                            this.state.handleBackButtonOnFirstViewString
                        }
                        handleBackButtonOnFirstViewStringChange={
                            this.handleBackButtonOnFirstViewStringChange
                        }
                    />
                )}
            </>
        );
    };

    viewsConfig = {
        [HelloWorldViewName]: {
            type: HelloWorld,
            props: {
                name: HelloWorldViewName,
                number: 1,
                title: "Hello World!",
                color: "white",
                style: { backgroundColor: "white" },
                toggleOptions: this.toggleOptions
            },
            sceneProps: {
                //to change scene state when needed (eg. when activated)
            }
        },
        [CommonViewNameTpl]: {
            type: CommonView,
            nameGenerator: getNextCommonViewName,
            props: { name: null, toggleOptions: this.toggleOptions },
            sceneProps: {
                //to change scene state when needed (eg. when activated)
            }
        }
    };
}
