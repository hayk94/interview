import {createContainer} from "meteor/react-meteor-data";
import ClientsTable from "../components/ClientsTable";
import AppContainer from "../components/AppContainer";
import FilterInput from "../components/FilterInput";
import ResetButton from "../components/ResetButton";
import HTML5Backend from "react-dnd-html5-backend";
import {Clients} from "../../collections/clients";
import {DragDropContext} from "react-dnd";
import React, {Component} from "react";
import update from "react/lib/update";
import {fromJS} from "immutable";

@DragDropContext(HTML5Backend)
class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            searchWord: "",
            clients: [],
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
        if (clients[index][name] === value) {
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
            <AppContainer title="Clients">
                <FilterInput
                    placeholder="Filter"
                    handleFilterChange={this.handleFilterChange}/>
                <ClientsTable
                    clients={clients}
                    moveRow={this.moveRow}
                    editingIndex={editingIndex}
                    handleUpdate={this.handleUpdate}
                    removeOtherEdits={this.removeOtherEdits}/>
                <ResetButton editingIndex={editingIndex} handleReset={this.handleReset} text="Exit"/>
            </AppContainer>
        );
    }
}

export default createContainer(() => ({
    clients: Clients.find({}).fetch(),
}), App);
