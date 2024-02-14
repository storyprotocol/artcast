'use client';

// @ts-ignore
export function ShareButton(props) {
    return (
        <button onClick={() => navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_BASE_URL}/cast/${props.castId}`)} className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-gray-200 focus:text-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700">
            {props.children}
        </button>
    )
}