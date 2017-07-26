import React from "react";

const ResetButton = ({editingIndex, handleReset, text}) => {
    return (
        (editingIndex !== null && editingIndex !== false) ?
            <button className="btn btn-warning exit-button" onClick={handleReset}>
                {text}
            </button> :
            null
    )
};

export default ResetButton;
