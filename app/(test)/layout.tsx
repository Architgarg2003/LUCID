import { LoaderProvider } from "../LoaderContext";

export default async function Test({
    children,
}: {
    children: React.ReactNode;
}) {


    return (

        <div className="flex overflow-hidden">
            <LoaderProvider>
                <div className="flex-1 overflow-hidden bg-gray-200">
                        {children}
                </div>
            </LoaderProvider>
        </div>

    );
}
