import React, {Component} from 'react';
import './css/DragAndDrop.css';


export function DragDropFile({controlarArchivo , AcceptsFile , multiple  }) {

  const [dragActive, setDragActive] = React.useState(false);
  const inputRef = React.useRef(null);

  // if (AcceptsFile) {
  //   console.log("hay prop" , AcceptsFile);
  // }

  console.log(AcceptsFile);
  
  // Escucha de accion con drag
  const handleDrag = function(e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };
  
  // triggers cuando se suelda archivo
  const handleDrop = function(e) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      controlarArchivo(e.dataTransfer.files);
    }
  };
  
  // triggers cuando se selecciona con click
  const handleChange = function(e) {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      controlarArchivo(e.target.files);
    }
  };
  
  const onButtonClick = () => {
    inputRef.current.click();
  };
  
  return (
    <form id='form-file-upload' onDragEnter={handleDrag} onSubmit={(e) => e.preventDefault()}>
      <input ref={inputRef} type='file' id='input-file-upload'  accept={AcceptsFile} multiple={multiple} onChange={handleChange} />
      <label id='label-file-upload' htmlFor='input-file-upload' className={dragActive ? 'drag-active' : '' }>
        <div style={{display:'flex', flexDirection:'column', width:'100%'}}>
          <div>
            <i className='fas fa-upload' style={{ fontSize: '50px', color: '#64b7f6', marginBottom: '10px' }} ></i>
          </div>
          <div>
            <p>Arrastar documento </p>
            <p>Formatos aceptados: {AcceptsFile}</p>
            <button className='upload-button' onClick={onButtonClick}>Subir archivo</button>
          </div>
        </div>
      </label>
      { dragActive && <div id='drag-file-element' onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}> </div> }
    </form>
  );
};

DragDropFile.defaultProps = {
  multiple:false,
  AcceptsFile: '.ods , .xls '
}