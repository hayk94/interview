import React, {Component} from 'react';
import update from 'react/lib/update';
import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import ClientRow from '../components/ClientRow';
import {createContainer} from 'meteor/react-meteor-data';
import {Clients} from "../../collections/clients";
import {fromJS} from "immutable";

@DragDropContext(HTML5Backend)
class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            searchWord: "",
            clients: this.props.clients || [],
            editingIndex: null
        }
    }

    componentDidUpdate(prevProps) {
        const {clients} = this.props;

        if (prevProps.clients.length === 0 && !fromJS(clients).equals(fromJS(prevProps.clients))) {
            this.setState({clients: clients});
        }
    }

    getClients = () => {
        const {clients, searchWord} = this.state;

        return clients.filter(client =>
            client.name.includes(searchWord) ||
            client.email.includes(searchWord) ||
            client.phone.includes(searchWord))
    };

    handleFilterChange = ({currentTarget: {value}}) => {
        const newValue = value.trim().toLowerCase(),
            {searchWord} = this.state;

        if (searchWord !== newValue) {
            this.setState({searchWord: newValue});
        }
    };

    moveRow = (dragIndex, hoverIndex) => {
        const {clients} = this.state,
            dragClient = clients[dragIndex];

        this.setState(update(this.state, {
            clients: {
                $splice: [
                    [dragIndex, 1],
                    [hoverIndex, 0, dragClient],
                ],
            },
        }));
    };

    removeOtherEdits = index => {
        this.setState({editingIndex: index});
    };

    handleUpdate = ({index, id, name, value}) => {
        const clients = this.getClients();
        if(clients[index][name] === value) {
            this.handleReset();
            return;
        } else {
            clients[index][name] = value;
            this.setState({clients});
        }
        Clients.update(id, {
            $set: {[name]: value},
        });
        this.handleReset();
    };

    handleReset = () => {
        this.setState({editingIndex: false});
    };

    render() {
        const clients = this.getClients(),
            {editingIndex} = this.state;

        return (
            <div className="row">
                <div className="col-md-6 col-md-offset-3 main-container">
                    <h3 className="text-center">Clients</h3>
                    <div id="custom-search-input">
                        <div className="input-group col-md-12">
                            <input
                                type="text"
                                placeholder="Filter"
                                onChange={this.handleFilterChange}
                                className="search-query form-control"/>
                            <span className="input-group-btn">
                                <button className="btn btn-primary" type="button">
                                    <span className="glyphicon glyphicon-search"></span>
                                </button>
                            </span>
                        </div>
                    </div>
                    <table className="table table-stripped table-hover client-table">
                        <thead>
                        <tr>
                            <th className="text-center">Name</th>
                            <th className="text-center">Email</th>
                            <th className="text-center">Phone</th>
                        </tr>
                        </thead>
                        <tbody className="text-center">
                        {clients.map((client, index) => (
                            <ClientRow
                                key={index}
                                index={index}
                                client={client}
                                moveRow={this.moveRow}
                                handleUpdate={this.handleUpdate}
                                removeOtherEdits={this.removeOtherEdits}
                                editing={editingIndex !== null && editingIndex !== index}
                            />
                        ))}
                        </tbody>
                    </table>
                    {editingIndex !== null && editingIndex !== false &&
                    <button className="btn btn-warning exit-button" onClick={this.handleReset}>
                        Exit
                    </button>}
                </div>
            </div>
        );
    }
}

export default createContainer(() => ({
    clients: Clients.find({}).fetch(),
}), App);
