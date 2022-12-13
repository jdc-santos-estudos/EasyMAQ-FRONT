import loadingImg from "../../images/loading.png";
import Show from '../ShowIf';

import './style.scss';

const LoadingScreen = props => {
  return (
    <Show if={props?.show > 0 }>
      <img src={loadingImg} alt="" className="loadingImage" />
      <div className="loadingScreen"></div>
    </Show>
  )
}

export default LoadingScreen;