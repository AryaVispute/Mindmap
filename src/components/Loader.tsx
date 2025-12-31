import './Loader.css';

export const Loader = () => {
  return (
    <div className="loader-wrapper">
      <div className="loader-container">
        <div className="loader">
          <div className="cell d-0" />
          <div className="cell d-1" />
          <div className="cell d-2" />
          <div className="cell d-1" />
          <div className="cell d-2" />
          <div className="cell d-2" />
          <div className="cell d-3" />
          <div className="cell d-3" />
          <div className="cell d-4" />
        </div>
        <div className="loader-text">MindMap</div>
      </div>
    </div>
  );
};

