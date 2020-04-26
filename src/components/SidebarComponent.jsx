import React from 'react';
import {Keyframes, animated} from 'react-spring/renderprops';
import {Form, Icon} from 'antd';
import delay from 'delay';
import styled from "styled-components";
import SearchComponent from './SearchComponents/SearchComponent';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {
    openSearchPanel,
    closeSearchPanel,
    toggleControls
} from "../actions/viewActions";

//CSS starts
const StyledSidebar = styled.div`
   position: absolute;
   top: 5px;
   left: 0;
   background-color: transparent;
   z-index: 2147483646;
`;
const StyledIcon = styled(Icon)`
position: absolute;
    margin: 10px 20px 20px 25px;
    color: #1890ff;
    font-size: 20px;
    cursor: pointer;
    padding: 5px 15px;
    border-radius: 4px;
    z-index: 2147483647;
    background-color: rgba(30, 30, 30, 0.8) !important;
    box-shadow: 2px 2px 4px rgba(24, 144, 255, 0.4) !important;
       &:hover {
                box-shadow: 2px 2px 10px rgba(24, 144, 255, 0.9) !important;
`;
//CSS Ends

// Creates a spring with predefined animation slots
const Sidebar = Keyframes.Spring({
    // Slots can take arrays/chains,
    peek: [
        {x: 0, from: {x: -100}, delay: 500},
        {x: -100, delay: 800},
    ],
    // single items,
    open: {delay: 0, x: 0},
    // or async functions with side-effects
    close: async call => {
        await delay(400)
        await call({delay: 0, x: -100})
    },
})

// Creates a keyframed trail
const Content = Keyframes.Trail({
    peek: [
        {x: 0, opacity: 1, from: {x: -100, opacity: 0}, delay: 600},
        {x: -100, opacity: 0, delay: 0},
    ],
    open: {x: 0, opacity: 1, delay: 100},
    close: {x: -100, opacity: 0, delay: 0},
})

class SidebarComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            sidebarWidth: 0
        };
    }

    toggle = () => {
        switch (this.props.view.searchPanelIsOpen) {
            case false:
                return (
                    this.props.openSearchPanel()
                );
            case true:
                return (
                    this.props.closeSearchPanel()
                );
        }
    };

    componentDidUpdate(prevProps, prevState) {
        const open = this.props.view.searchPanelIsOpen;

        if (open !== prevProps.view.searchPanelIsOpen && open) {
            this.setState({
                sidebarWidth: 'auto',
            });
        } else if (open !== prevProps.view.searchPanelIsOpen && !open) {
            setTimeout(() => {
                this.setState({
                    sidebarWidth: 0,
                });
            }, 800);
        }
    }

    render() {
        const state = this.props.view.searchPanelIsOpen ? 'open' : 'close';
        const icon = this.props.view.searchPanelIsOpen ? 'fold' : 'unfold';
        const items = [
            <SearchComponent/>
        ];

        return (
            <StyledSidebar>
                {this.props.view.showControls ?
                    <StyledIcon
                        type={`menu-${icon}`}
                        onClick={this.toggle}
                    /> : null}
                <Sidebar native state={state}>
                    {({x}) => (
                        <animated.div
                            className="sidebar"
                            style={{
                                transform: x.interpolate(x => `translate3d(${x}%,0,0)`),
                                width: this.state.sidebarWidth
                            }}>
                            <Content
                                native
                                items={items}
                                //keys={items.map((_, i) => i)}
                                reverse={!this.props.view.searchPanelIsOpen}
                                state={state}>
                                {(item, i) => ({x, ...props}) => (
                                    <animated.div
                                        style={{
                                            transform: x.interpolate(x => `translate3d(${x}%,0,0)`),
                                            ...props,
                                        }}>
                                        <Form.Item className={i === 0 ? 'middle' : ''}>
                                            {item}
                                        </Form.Item>
                                    </animated.div>
                                )}
                            </Content>
                        </animated.div>
                    )}
                </Sidebar>
            </StyledSidebar>
        )
    }
}

SidebarComponent.propTypes = {
    searchPanelIsOpen: PropTypes.bool,
    showControls: PropTypes.bool
};

const mapStateToProps = state => ({
    view: state.view
});

export default connect(mapStateToProps, {
    openSearchPanel,
    closeSearchPanel,
    toggleControls
})(SidebarComponent);