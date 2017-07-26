import {DragSource, DropTarget} from "react-dnd";
import React, {Component} from "react";

const cardSource = {
    beginDrag({index}) {
        return {index};
    }
};

const cardTarget = {
    hover({index, moveRow}, monitor) {
        const dragIndex = monitor.getItem().index;
        const hoverIndex = index;

        if (dragIndex === hoverIndex) {
            return;
        }

        moveRow(dragIndex, hoverIndex);
        monitor.getItem().index = hoverIndex;
    },
};

const defaultState = {
    name: true,
    email: true,
    phone: true
};

@DropTarget('row', cardTarget, connect => ({
    connectDropTarget: connect.dropTarget(),
}))
@DragSource('row', cardSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
}))
export default class ClientRow extends Component {

    constructor(props) {
        super(props);

        this.state = {...defaultState}
    }

    componentDidUpdate(prevProps) {
        const {editing} = this.props;

        if (editing === true && prevProps.editing === false) {
            this.reset();
        }
    }

    showInput = inputName => {
        if (this.state[inputName] === false) {
            return;
        }
        const {removeOtherEdits, index} = this.props;
        const newState = {...defaultState};
        newState[inputName] = false;
        this.setState(newState, removeOtherEdits(index));

    };

    handleKeyPress = ({key, currentTarget: {name, value}}) => {
        if (key === "Enter") {
            const {client, index, handleUpdate} = this.props;
            handleUpdate({index, id: client._id, name, value});
        }
    };

    reset = () => {
        this.setState({...defaultState});
    };

    render() {
        const {client, isDragging, connectDragSource, connectDropTarget} = this.props;
        const {name, email, phone} = this.state;
        const opacity = isDragging ? 0.75 : 1;

        return connectDragSource(connectDropTarget(
            <tr style={{opacity}}>
                <td onClick={() => this.showInput("name")}>
                    {name ?
                        client.name :
                        <input
                            name="name"
                            autoFocus={true}
                            className="form-control"
                            defaultValue={client.name}
                            onKeyPress={this.handleKeyPress}/>}
                </td>
                <td onClick={() => this.showInput("email")}>
                    {email ?
                        client.email :
                        <input
                            type="email"
                            name="email"
                            autoFocus={true}
                            className="form-control"
                            defaultValue={client.email}
                            onKeyPress={this.handleKeyPress}/>}
                </td>
                <td onClick={() => this.showInput("phone")}>
                    {phone ?
                        client.phone :
                        <input
                            name="phone"
                            autoFocus={true}
                            className="form-control"
                            defaultValue={client.phone}
                            onKeyPress={this.handleKeyPress}/>}
                </td>
            </tr>,
        ));
    }
}
