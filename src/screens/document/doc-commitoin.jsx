import React from 'react'

export default function DocCommitoin() {
    return (
        <div className="panel panel-inverse flex-1 m-0 d-flex flex-column overflow-hidden">
        <div className="panel-body p-0 flex-1 overflow-hidden">
          <div className="file-manager h-100" id="fileManager">
            <div className="file-manager-toolbar">
              <button type="button" className="btn shadow-none text-body border-0" disabled>
                <i className="fa fa-lg me-1 fa-plus" /> File
              </button>
              <button type="button" className="btn shadow-none text-body border-0" disabled>
                <i className="fa fa-lg me-1 fa-plus" /> Folder
              </button>
              <button type="button" className="btn shadow-none text-body  border-0" disabled >
                <i className="fa fa-lg me-1 fa-copy" /> Copy
              </button>
              <button type="button" className="btn shadow-none text-body  border-0" disabled >
                <i className="fa fa-lg me-1 fa-move" /> Move
              </button>
              <button type="button" className="btn shadow-none text-body border-0" disabled>
                <i className="fa fa-lg me-1 fa-upload" /> Upload
              </button>
              <button type="button" className="btn shadow-none text-body  border-0" disabled  >
                <i className="fa fa-lg me-1 fa-download" /> Download
              </button>
              <button type="button" disabled className="btn shadow-none text-body"  >
                <i className="fa fa-lg me-1 fa-xmark" /> Delete
              </button>
              <button type="button" className="btn shadow-none text-body  border-0" disabled  >
                <i className="fa fa-lg me-1 fa-rotate-left" /> Restore
              </button>
              <button type="button" className="btn shadow-none text-body  border-0" disabled >
                <i className="fa fa-lg me-1 fa-file" /> Rename
              </button>
              <button type="button" className="btn shadow-none text-body  border-0" disabled >
                <i className="fa fa-lg me-1 fa-pen" /> Edit
              </button>
              <button type="button" className="btn shadow-none text-body  border-0" disabled >
                <i className="fa fa-lg me-1 fa-pen-to-square" /> HTML Editor
              </button>
              <button type="button" className="btn shadow-none text-body  border-0" disabled >
                <i className="fa fa-lg me-1 fa-key" /> Permissions
              </button>
              <button type="button" className="btn shadow-none text-body  border-0" disabled >
                <i className="fa fa-lg me-1 fa-file" /> View
              </button>
              <button type="button" className="btn shadow-none text-body  border-0" disabled>
                <i className="fa fa-lg me-1 fa-lock-open" /> Extract
              </button>
              <button type="button" className="btn shadow-none text-body  border-0" disabled >
                <i className="fa fa-lg me-1 fa-file-zipper" /> Compress
              </button>
            </div>
            <div className="file-manager-container">
              <div className="file-manager-sidebar">
                <div className="file-manager-sidebar-mobile-toggler">
                  <button type="button" className="btn btn-danger" data-toggle-class="file-manager-sidebar-mobile-toggled" data-target="#fileManager"  >
                    <i className="fas fa-lg fa-search" />
                  </button>
                </div>
                </div>
                </div>
                </div>
                </div>
           
        </div>
    )
}
