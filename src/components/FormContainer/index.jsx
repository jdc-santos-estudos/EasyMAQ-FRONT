
import './style.scss';

const FormContainer = props => {
  return (
    <div className={"FormContainer " + props.className}>
      {props.children}
    </div>
  )
}

export default FormContainer;