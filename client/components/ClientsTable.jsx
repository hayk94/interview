import React from "react";
import ClientRow from "./ClientRow";

const ClientsTable = ({clients, editingIndex, moveRow, handleUpdate, removeOtherEdits}) => {
    return (
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
                    moveRow={moveRow}
                    handleUpdate={handleUpdate}
                    removeOtherEdits={removeOtherEdits}
                    editing={editingIndex !== null && editingIndex !== index}
                />
            ))}
            </tbody>
        </table>
    )
};

export default ClientsTable;
