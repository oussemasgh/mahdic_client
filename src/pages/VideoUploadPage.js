import React, { useState, useEffect} from 'react';
import axios from "axios";
import UploadForm from "../components/upload/UploadForm";

export default function VideoUploadPage() {
  return (
    <>
      <div className="row">
        <div className="col-md-6">
         
            <div className="card-body">
              <UploadForm  />
            </div>
          </div>
        </div>
       
        
      
    </>
  );
 }
