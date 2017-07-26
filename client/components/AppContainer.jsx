import React from "react";

const AppContainer = ({children, title}) => {
    return (
        <div className="row">
            <div className="col-md-6 col-md-offset-3 main-container">
                <h3 className="text-center">{title}</h3>
                {children}
            </div>
        </div>
    )
};

export default AppContainer;
