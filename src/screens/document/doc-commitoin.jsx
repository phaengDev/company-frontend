import React from 'react'

export default function DocCommitoin() {
    return (
        <div id="content" class="app-content d-flex flex-column p-0">
            <div className="panel panel-inverse flex-1 m-0 d-flex flex-column overflow-hidden">
                <div className="panel-body p-0 flex-1 overflow-hidden">
                <div className="file-manager h-100" id="fileManager">
                    
                    <div className="file-manager-toolbar fixed-top-file ">
                        <button type="button" className="btn shadow-none text-body border-0">
                            <i className="fa fa-lg me-1 fa-plus" /> File
                        </button>
                        <button type="button" className="btn shadow-none text-body border-0">
                            <i className="fa fa-lg me-1 fa-plus" /> Folder
                        </button>
                        <button type="button" className="btn shadow-none text-body text-opacity-50 border-0" disabled="" >
                            <i className="fa fa-lg me-1 fa-copy" /> Copy
                        </button>
                        <button type="button" className="btn shadow-none text-body text-opacity-50 border-0" disabled="" >
                            <i className="fa fa-lg me-1 fa-move" /> Move
                        </button>
                        <button type="button" className="btn shadow-none text-body border-0">
                            <i className="fa fa-lg me-1 fa-upload" /> Upload
                        </button>
                        <button type="button" className="btn shadow-none text-body text-opacity-50 border-0" disabled=""  >
                            <i className="fa fa-lg me-1 fa-download" /> Download
                        </button>
                        <button type="button" className="btn shadow-none text-body text-opacity-50 border-0" disabled=""  >
                            <i className="fa fa-lg me-1 fa-xmark" /> Delete
                        </button>
                        <button type="button" className="btn shadow-none text-body text-opacity-50 border-0" disabled=""  >
                            <i className="fa fa-lg me-1 fa-rotate-left" /> Restore
                        </button>
                        <button type="button" className="btn shadow-none text-body text-opacity-50 border-0" disabled="" >
                            <i className="fa fa-lg me-1 fa-file" /> Rename
                        </button>
                        <button type="button" className="btn shadow-none text-body text-opacity-50 border-0" disabled="" >
                            <i className="fa fa-lg me-1 fa-pen" /> Edit
                        </button>
                        <button type="button" className="btn shadow-none text-body text-opacity-50 border-0" disabled="" >
                            <i className="fa fa-lg me-1 fa-pen-to-square" /> HTML Editor
                        </button>
                        <button type="button" className="btn shadow-none text-body text-opacity-50 border-0" disabled="" >
                            <i className="fa fa-lg me-1 fa-key" /> Permissions
                        </button>
                        <button type="button" className="btn shadow-none text-body text-opacity-50 border-0" disabled="" >
                            <i className="fa fa-lg me-1 fa-file" /> View
                        </button>
                        <button type="button" className="btn shadow-none text-body text-opacity-50 border-0" disabled="">
                            <i className="fa fa-lg me-1 fa-lock-open" /> Extract
                        </button>
                        <button type="button" className="btn shadow-none text-body text-opacity-50 border-0" disabled="" >
                            <i className="fa fa-lg me-1 fa-file-zipper" /> Compress
                        </button>
                    </div>

                    <div class="row ">
                        <div style={{ width: 330 }}>
                            <nav class="navbar navbar-sticky d-none d-xl-block my-n4 py-4 h-100 text-end">
                                <nav class="nav" id="bsSpyTarget">
                                    <a class="nav-link active" href="#general" data-toggle="scroll-to">General</a>
                                    <a class="nav-link" href="#notifications" data-toggle="scroll-to">Notifications</a>
                                    <a class="nav-link" href="#privacyAndSecurity" data-toggle="scroll-to">Privacy and security</a>
                                    <a class="nav-link" href="#payment" data-toggle="scroll-to">Payment</a>
                                    <a class="nav-link" href="#shipping" data-toggle="scroll-to">Shipping</a>
                                    <a class="nav-link" href="#mediaAndFiles" data-toggle="scroll-to">Media and Files</a>
                                    <a class="nav-link" href="#languages" data-toggle="scroll-to">Languages</a>
                                    <a class="nav-link" href="#system" data-toggle="scroll-to">System</a>
                                    <a class="nav-link" href="#resetSettings" data-toggle="scroll-to">Reset settings</a>
                                </nav>
                            </nav>

                        </div>


                        <div class="col-xl-8" id="bsSpyContent">

                            <div id="general" class="mb-4 pb-3">
                                <h4 class="d-flex align-items-center mb-2">
                                    <span class="iconify fs-24px me-2 text-body text-opacity-75 my-n1" data-icon="solar:user-bold-duotone"></span> General
                                </h4>
                                <p>View and update your general account information and settings.</p>
                                <div class="card">
                                    <div class="list-group list-group-flush fw-bold">
                                        <div class="list-group-item d-flex align-items-center">
                                            <div class="flex-fill">
                                                <div>Name</div>
                                                <div class="text-body text-opacity-60">Sean Ngu</div>
                                            </div>
                                            <div class="w-100px">
                                                <a href="#modalEdit" data-bs-toggle="modal" class="btn btn-secondary w-100px">Edit</a>
                                            </div>
                                        </div>
                                        <div class="list-group-item d-flex align-items-center">
                                            <div class="flex-fill">
                                                <div>Username</div>
                                                <div class="text-body text-opacity-60">@seantheme</div>
                                            </div>
                                            <div>
                                                <a href="#modalEdit" data-bs-toggle="modal" class="btn btn-secondary w-100px">Edit</a>
                                            </div>
                                        </div>
                                        <div class="list-group-item d-flex align-items-center">
                                            <div class="flex-fill">
                                                <div>Phone</div>
                                                <div class="text-body text-opacity-60">+1-202-555-0183</div>
                                            </div>
                                            <div>
                                                <a href="#modalEdit" data-bs-toggle="modal" class="btn btn-secondary w-100px">Edit</a>
                                            </div>
                                        </div>
                                        <div class="list-group-item d-flex align-items-center">
                                            <div class="flex-fill">
                                                <div>Email address</div>
                                                <div class="text-body text-opacity-60"><a href="/cdn-cgi/l/email-protection" class="__cf_email__" data-cfemail="4a393f3a3a25383e0a392f2b243e222f272f64292527">[email&#160;protected]</a></div>
                                            </div>
                                            <div>
                                                <a href="#modalEdit" data-bs-toggle="modal" class="btn btn-secondary disabled w-100px">Edit</a>
                                            </div>
                                        </div>
                                        <div class="list-group-item d-flex align-items-center">
                                            <div class="flex-fill">
                                                <div>Password</div>
                                            </div>
                                            <div>
                                                <a href="#modalEdit" data-bs-toggle="modal" class="btn btn-secondary w-100px">Edit</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div id="notifications" class="mb-4 pb-3">
                                <h4 class="d-flex align-items-center mb-2 mt-3">
                                    <span class="iconify fs-24px me-2 text-body text-opacity-75 my-n1" data-icon="solar:bell-bold-duotone"></span>
                                    Notifications
                                </h4>
                                <p>Enable or disable what notifications you want to receive.</p>
                                <div class="card">
                                    <div class="list-group list-group-flush fw-bold">
                                        <div class="list-group-item d-flex align-items-center">
                                            <div class="flex-fill">
                                                <div>Comments</div>
                                                <div class="text-body text-opacity-60 d-flex align-items-center">
                                                    <i class="fa fa-circle fs-6px mt-1px fa-fw text-success me-2"></i> Enabled (Push, SMS)
                                                </div>
                                            </div>
                                            <div>
                                                <a href="#modalEdit" data-bs-toggle="modal" class="btn btn-secondary w-100px">Edit</a>
                                            </div>
                                        </div>
                                        <div class="list-group-item d-flex align-items-center">
                                            <div class="flex-fill">
                                                <div>Tags</div>
                                                <div class="text-body text-opacity-60 d-flex align-items-center">
                                                    <i class="fa fa-circle fs-6px mt-1px fa-fw text-body text-opacity-25 me-2"></i> Disabled
                                                </div>
                                            </div>
                                            <div>
                                                <a href="#modalEdit" data-bs-toggle="modal" class="btn btn-secondary w-100px">Edit</a>
                                            </div>
                                        </div>
                                        <div class="list-group-item d-flex align-items-center">
                                            <div class="flex-fill">
                                                <div>Reminders</div>
                                                <div class="text-body text-opacity-60 d-flex align-items-center">
                                                    <i class="fa fa-circle fs-6px mt-1px fa-fw text-success me-2"></i> Enabled (Push, Email, SMS)
                                                </div>
                                            </div>
                                            <div>
                                                <a href="#modalEdit" data-bs-toggle="modal" class="btn btn-secondary w-100px">Edit</a>
                                            </div>
                                        </div>
                                        <div class="list-group-item d-flex align-items-center">
                                            <div class="flex-fill">
                                                <div>New orders</div>
                                                <div class="text-body text-opacity-60 d-flex align-items-center">
                                                    <i class="fa fa-circle fs-6px mt-1px fa-fw text-success me-2"></i> Enabled (Push, Email, SMS)
                                                </div>
                                            </div>
                                            <div>
                                                <a href="#modalEdit" data-bs-toggle="modal" class="btn btn-secondary w-100px">Edit</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div id="privacyAndSecurity" class="mb-4 pb-3">
                                <h4 class="d-flex align-items-center mb-2 mt-3">
                                    <span class="iconify fs-24px me-2 text-body text-opacity-75 my-n1" data-icon="solar:lock-password-bold-duotone"></span>
                                    Privacy and security
                                </h4>
                                <p>Limit the account visibility and the security settings for your website.</p>
                                <div class="card">
                                    <div class="list-group list-group-flush fw-bold">
                                        <div class="list-group-item d-flex align-items-center">
                                            <div class="flex-fill">
                                                <div>Who can see your future posts?</div>
                                                <div class="text-body text-opacity-60 d-flex align-items-center">
                                                    Friends only
                                                </div>
                                            </div>
                                            <div>
                                                <a href="#modalEdit" data-bs-toggle="modal" class="btn btn-secondary w-100px">Edit</a>
                                            </div>
                                        </div>
                                        <div class="list-group-item d-flex align-items-center">
                                            <div class="flex-fill">
                                                <div>Photo tagging</div>
                                                <div class="text-body text-opacity-60 d-flex align-items-center">
                                                    <i class="fa fa-circle fs-6px mt-1px fa-fw text-success me-2"></i> Enabled
                                                </div>
                                            </div>
                                            <div>
                                                <a href="#modalEdit" data-bs-toggle="modal" class="btn btn-secondary w-100px">Edit</a>
                                            </div>
                                        </div>
                                        <div class="list-group-item d-flex align-items-center">
                                            <div class="flex-fill">
                                                <div>Location information</div>
                                                <div class="text-body text-opacity-60 d-flex align-items-center">
                                                    <i class="fa fa-circle fs-6px mt-1px fa-fw text-body text-opacity-25 me-2"></i> Disabled
                                                </div>
                                            </div>
                                            <div>
                                                <a href="#modalEdit" data-bs-toggle="modal" class="btn btn-secondary w-100px">Edit</a>
                                            </div>
                                        </div>
                                        <div class="list-group-item d-flex align-items-center">
                                            <div class="flex-fill">
                                                <div>Firewall</div>
                                                <div class="text-body text-opacity-60 d-block d-xl-flex align-items-center">
                                                    <div class="d-flex align-items-center"><i class="fa fa-circle fs-6px mt-1px fa-fw text-body text-opacity-25 me-2"></i> Disabled</div>
                                                    <span class="bg-warning bg-opacity-10 text-warning ms-xl-3 mt-1 d-inline-block mt-xl-0 px-1 rounded-sm">
                                                        <i class="fa fa-exclamation-circle text-warning fs-12px me-1"></i>
                                                        <span class="text-warning">Please enable the firewall for your website</span>
                                                    </span>
                                                </div>
                                            </div>
                                            <div>
                                                <a href="#modalEdit" data-bs-toggle="modal" class="btn btn-secondary w-100px">Edit</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div id="payment" class="mb-4 pb-3">
                                <h4 class="d-flex align-items-center mb-2 mt-3">
                                    <span class="iconify fs-24px me-2 text-body text-opacity-75 my-n1" data-icon="solar:bag-4-bold-duotone"></span>
                                    Payment
                                </h4>
                                <p>Manage your website payment provider</p>
                                <div class="card">
                                    <div class="list-group list-group-flush fw-bold">
                                        <div class="list-group-item d-flex align-items-center">
                                            <div class="flex-fill">
                                                <div>Allowed payment method</div>
                                                <div class="text-body text-opacity-60">
                                                    Paypal, Credit Card, Apple Pay, Amazon Pay, Google Wallet, Alipay, Wechatpay
                                                </div>
                                            </div>
                                            <div>
                                                <a href="#modalEdit" data-bs-toggle="modal" class="btn btn-secondary w-100px">Edit</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div id="shipping" class="mb-4 pb-3">
                                <h4 class="d-flex align-items-center mb-2 mt-3">
                                    <span class="iconify fs-24px me-2 text-body text-opacity-75 my-n1" data-icon="solar:box-bold-duotone"></span>
                                    Shipping
                                </h4>
                                <p>Allowed shipping area and zone setting</p>
                                <div class="card">
                                    <div class="list-group list-group-flush fw-bold">
                                        <div class="list-group-item d-flex align-items-center">
                                            <div class="flex-fill">
                                                <div>Allowed shipping method</div>
                                                <div class="text-body text-opacity-60">
                                                    Local, Domestic
                                                </div>
                                            </div>
                                            <div>
                                                <a href="#modalEdit" data-bs-toggle="modal" class="btn btn-secondary w-100px">Edit</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div id="mediaAndFiles" class="mb-4 pb-3">
                                <h4 class="d-flex align-items-center mb-2 mt-3">
                                    <span class="iconify fs-24px me-2 text-body text-opacity-75 my-n1" data-icon="solar:camera-bold-duotone"></span>
                                    Media and Files
                                </h4>
                                <p>Allowed files and media format upload setting</p>
                                <div class="card">
                                    <div class="list-group list-group-flush fw-bold">
                                        <div class="list-group-item d-flex align-items-center">
                                            <div class="flex-fill">
                                                <div>Allowed files and media format</div>
                                                <div class="text-body text-opacity-60">
                                                    .png, .jpg, .gif, .mp4
                                                </div>
                                            </div>
                                            <div>
                                                <a href="#modalEdit" data-bs-toggle="modal" class="btn btn-secondary w-100px">Edit</a>
                                            </div>
                                        </div>
                                        <div class="list-group-item d-flex align-items-center">
                                            <div class="flex-fill">
                                                <div>Media and files cdn</div>
                                                <div class="text-body text-opacity-60 d-flex align-items-center">
                                                    <i class="fa fa-circle fs-6px mt-1px fa-fw text-body text-opacity-25 me-2"></i> Disabled
                                                </div>
                                            </div>
                                            <div>
                                                <a href="#modalEdit" data-bs-toggle="modal" class="btn btn-secondary w-100px">Edit</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div id="languages" class="mb-4 pb-3">
                                <h4 class="d-flex align-items-center mb-2 mt-3">
                                    <span class="iconify fs-24px me-2 text-body text-opacity-75 my-n1" data-icon="solar:globus-bold-duotone"></span>
                                    Languages
                                </h4>
                                <p>Language font support and auto translation enabled</p>
                                <div class="card">
                                    <div class="list-group list-group-flush fw-bold">
                                        <div class="list-group-item d-flex align-items-center">
                                            <div class="flex-fill">
                                                <div>Language enabled</div>
                                                <div class="text-body text-opacity-60">
                                                    English (default), Chinese, France, Portuguese, Japense
                                                </div>
                                            </div>
                                            <div>
                                                <a href="#modalEdit" data-bs-toggle="modal" class="btn btn-secondary w-100px">Edit</a>
                                            </div>
                                        </div>
                                        <div class="list-group-item d-flex align-items-center">
                                            <div class="flex-fill">
                                                <div>Auto translation</div>
                                                <div class="text-body text-opacity-60 d-flex align-items-center">
                                                    <i class="fa fa-circle fs-6px mt-1px fa-fw text-success me-2"></i> Enabled
                                                </div>
                                            </div>
                                            <div>
                                                <a href="#modalEdit" data-bs-toggle="modal" class="btn btn-secondary w-100px">Edit</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div id="system" class="mb-4 pb-3">
                                <h4 class="d-flex align-items-center mb-2 mt-3">
                                    <span class="iconify fs-24px me-2 text-body text-opacity-75 my-n1" data-icon="solar:ssd-round-bold-duotone"></span>
                                    System
                                </h4>
                                <p>System storage, bandwidth and database setting</p>
                                <div class="card">
                                    <div class="list-group list-group-flush fw-bold">
                                        <div class="list-group-item d-flex align-items-center">
                                            <div class="flex-fill">
                                                <div>Web storage</div>
                                                <div class="text-body text-opacity-60">
                                                    40.8gb / 100gb
                                                </div>
                                            </div>
                                            <div>
                                                <a href="#modalEdit" data-bs-toggle="modal" class="btn btn-secondary w-100px">Manage</a>
                                            </div>
                                        </div>
                                        <div class="list-group-item d-flex align-items-center">
                                            <div class="flex-fill">
                                                <div>Monthly bandwidth</div>
                                                <div class="text-body text-opacity-60">
                                                    Unlimited
                                                </div>
                                            </div>
                                        </div>
                                        <div class="list-group-item d-flex align-items-center">
                                            <div class="flex-fill">
                                                <div>Database</div>
                                                <div class="text-body text-opacity-60">
                                                    MySQL version 8.0.19
                                                </div>
                                            </div>
                                            <div>
                                                <a href="#modalEdit" data-bs-toggle="modal" class="btn btn-secondary w-100px disabled">Update</a>
                                            </div>
                                        </div>
                                        <div class="list-group-item d-flex align-items-center">
                                            <div class="flex-fill">
                                                <div>Platform</div>
                                                <div class="text-body text-opacity-60">
                                                    PHP 7.4.4, NGINX 1.17.0
                                                </div>
                                            </div>
                                            <div>
                                                <a href="#modalEdit" data-bs-toggle="modal" class="btn btn-success w-100px">Update</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div id="resetSettings" class="mb-4 pb-3">
                                <h4 class="d-flex align-items-center mb-2 mt-3">
                                    <span class="iconify fs-24px me-2 text-body text-opacity-75 my-n1" data-icon="solar:restart-bold-duotone"></span>
                                    Reset settings
                                </h4>
                                <p>Reset all website setting to factory default setting.</p>
                                <div class="card">
                                    <div class="list-group list-group-flush fw-bold">
                                        <div class="list-group-item d-flex align-items-center">
                                            <div class="flex-fill">
                                                <div>Reset Settings</div>
                                                <div class="text-body text-opacity-60">
                                                    This action will clear and reset all the current website setting.
                                                </div>
                                            </div>
                                            <div>
                                                <a href="#" class="btn btn-secondary w-100px">Reset</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
