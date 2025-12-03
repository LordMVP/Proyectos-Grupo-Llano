import React, { Fragment } from 'react';
import { Form } from "react-bootstrap";


const CheckBoxTable = (props) => {
    const {
        onClick,
        checked,
        id,
        row,
        paramDisabled
    } = props;
    let disabled = row[paramDisabled]
    return (
        <Fragment>
            <Form.Check type="checkbox"
                checked={checked}
                id={id}
                onClick={(e) => {
                    onClick(id, disabled, row);
                }}
                disabled={disabled}
            />
        </Fragment>
    )

}

export default CheckBoxTable;