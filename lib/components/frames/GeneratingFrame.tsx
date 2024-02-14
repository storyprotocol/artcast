// @ts-nocheck
export default function GeneratingFrame(props) {
    return (
        <div
            style={{
                height: '100%',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#fff',
                gap: '10px'
            }}
        >
            <p>Generating your new Artcast...</p>
            <div style={{ display: 'flex' }}>
                <p>Please wait ~10 seconds and</p>
                <p>then press the 'Refresh' button.</p>
            </div>
        </div>


    )
}