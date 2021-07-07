import React from 'react';
import PropTypes from 'prop-types';

import { GlobalContext } from '../../store/global';

const MessageView1 = ({ setStep }) => {
  const { setActiveModule, WPS } = React.useContext(GlobalContext);
  const state = {};

  const onValueChange = (event) => {
    state.value = event.target.value;
  };

  const submit = () => {
    if (!isNaN(parseInt(state.value))) {
      WPS.Execute('set_resolution', `resolution=${state.value}`)
        .then(() => {
          setStep(1);
        })
        .catch(err => {
          console.error(err.message);
        });
    }
  };

  return (
    <>
      <div>
        Set the resolution in meters.
        <form>
          <input type="number" value={state.value} onChange={onValueChange} />
        </form>
      </div>
      <div className="btn-group">
        <button type="button" className="btn btn-primary" onClick={submit}>Submit</button>
        <button type="button" className="btn btn-secondary" onClick={() => setActiveModule(null)}>Cancel</button>
      </div>
    </>
  );
};

MessageView1.propTypes = {
  setStep: PropTypes.func.isRequired,
};

const MessageView2 = () => {
  return (
    <div>
      Resolution has been set.
    </div>
  );
};

export const SetResolutionModule = () => {
  const [step, setStep] = React.useState(0);

  return [
    <MessageView1 key={step} setStep={setStep} />,
    <MessageView2 key={step} />
  ][step];
};
