import React from 'react'
export const PageNotFound = () => {
    const styles = `.card {
        position: relative;
        display: flex;
        flex-direction: column;
        min-width: 0;
        word-wrap: break-word;
        background-color: #fff;
        background-clip: border-box;
        border: 1px solid rgba(0, 0, 0, 0.04);
        border-radius: .25rem;
    }
                    
    .card .card-header {
        background-color: #fff;
        border-bottom: none;
    }`; 

    return (
        <>
            <div className="row justify-content-center mb-5">
                <div className="col-md-12 col-sm-12">
                    <div className="card shadow-lg border-0 rounded-lg mt-5 mx-auto" style={{ width: "30rem" }}>
                        <h3 className="card-header display-1 text-muted text-center">
                            404
                        </h3>

                        <span className="card-subtitle mb-2 text-muted text-center">
                            Page Could Not Be Found
                        </span>

                        <div className="card-body mx-auto">
                            <a type="button" href="/" className="btn btn-sm btn-info text-white">
                                Back To Home
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <style>{styles}</style>
        </>
    )
}
