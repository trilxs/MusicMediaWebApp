import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import './FormSecondPage.css';
import validate from '../../../utils/ValidateWorkflow';
import _ from 'lodash';
import FormFields from './FormFields';
import Button from '../../../utils/Button/Button';

class FormSecondPage extends Component {
    renderFields() {
        return _.map(FormFields, ({ key, type, label, name, component: { RenderField }, value }) => {
            if (type === "text") {
                return <Field  key={key} type={type} label={label} name={name} component={RenderField} />
            }
            else if (type === "radio") {
                // For Fields with type "radio", we must wrap it around a label element for it to work
                return <label><Field key={key} type={type} label={label} name={name} component={RenderField} value={value} /></label>
            }
        });
    }

    render() {
        var { previousPage, handleSubmit } = this.props;
        console.log(previousPage);
        return (
            <form onSubmit={handleSubmit}>
                {this.renderFields()}
                <Button text="Previous" buttonStyles="orange btn-flat left white-text" handleOnClick={previousPage} />
                <Button text="Next" buttonStyles="orange btn-flat right white-text" />
            </form>
        );
    }
}
    
export default reduxForm({
    form: 'workflowForm',
    destroyOnUnmount: false,
    validate
})(FormSecondPage);