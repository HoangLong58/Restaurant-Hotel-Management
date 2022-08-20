import React from 'react'

const Loader = () => {
    return (
        <>
            <div className="loader">
                <div className="loader__figure"></div>
            </div>

            <svg className="hidden">
                <svg id="icon-nav" viewBox="0 0 152 63">
                    <title>navarrow</title>
                    <path d="M115.737 29L92.77 6.283c-.932-.92-1.21-2.84-.617-4.281.594-1.443 1.837-1.862 2.765-.953l28.429 28.116c.574.57.925 1.557.925 2.619 0 1.06-.351 2.046-.925 2.616l-28.43 28.114c-.336.327-.707.486-1.074.486-.659 0-1.307-.509-1.69-1.437-.593-1.442-.315-3.362.617-4.284L115.299 35H3.442C2.032 35 .89 33.656.89 32c0-1.658 1.143-3 2.552-3H115.737z" />
                </svg>
            </svg>
        </>
    )
}

export default Loader