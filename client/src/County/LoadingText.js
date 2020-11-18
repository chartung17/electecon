import React from "react";
import './styles/LoadingText.css'

/**
 * Custom loading text with 3 animated dots
 *
 * Props:
 * - id: element's id
 * - style: style of the text
 * - text: loading message
 *
 */
export default class LoadingText extends React.Component {
    render() {
        return (
            <div className={"loading-message"}
                id={this.props.id}
                style={this.props.style}>
                {this.props.text} <span>.</span><span>.</span><span>.</span>
            </div>
        );
    }
}
