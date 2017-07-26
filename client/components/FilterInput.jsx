import React from "react";

const FilterInput = ({handleFilterChange, placeholder}) => {
    return (
        <div id="custom-search-input">
            <div className="input-group col-md-12">
                <input
                    type="text"
                    placeholder={placeholder}
                    onChange={handleFilterChange}
                    className="search-query form-control"/>
                <span className="input-group-btn">
                    <button className="btn btn-primary" type="button">
                        <span className="glyphicon glyphicon-search"></span>
                    </button>
                </span>
            </div>
        </div>
    )
};

export default FilterInput;
