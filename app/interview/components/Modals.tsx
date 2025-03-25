import React from 'react'

interface ModalI {
    head: string,
    alert: string,
    action: () => void,
    action2?: () => void,
    button: string
}

const Modals = ({ head, alert, action, button, action2 }: ModalI) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg">
                <h2 className="text-xl font-bold  text-black mb-4">{head}</h2>
                <p className="mb-4 text-black">{alert}</p>
                <div className='flex flex-row justify-between'>
                    <button
                        onClick={action}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                    >
                        {button}
                    </button>
                    {/* <button
                        onClick={action2}
                        className="px-4 py-2 bg-red-400 text-white rounded-lg"
                    >
                        END
                    </button> */}
                </div>
            </div>
        </div>
    )
}

export default Modals