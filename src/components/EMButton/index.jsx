
import './style.scss'

const EMButton = ({text, className, disabled, onClick, type ='button'}) => {
  return (
    <button 
      type={type} 
      className={(disabled ? ' EMbuttonDisabled ':'EMbutton ')  + className} 
      disabled={disabled} 
      onClick={onClick}>
        {text}
      </button>
  )
}

export default EMButton;