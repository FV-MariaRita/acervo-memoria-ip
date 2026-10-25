import CardEntrevistador from "../components/CardEntrevistador"

const Entrevistadores = () => {

    return (
        <>

        <div className="flex flex-col items-center ">
            
            <div className="w-full max-w-3xl py-4 gap-4"> 

                <h1 className="font-title text-vinho text-2xl font-bold my-4 text-center">
                    Entrevistadores
                </h1>

                <p className="font-corpo text-grafite text-justify text-sm mb-6 px-6">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean egestas suscipit lacus, in iaculis nisi 
                    dictum placerat. Duis pretium rutrum vulputate. Nulla imperdiet mauris magna. Nam a rutrum leo. Aliquam 
                    tempor felis sit amet purus placerat, nec tristique odio mollis. In eget porta nulla. In laoreet, elit 
                    vel congue ornare, nulla nisi pretium dolor, vestibulum euismod quam orci non diam. 
                </p>
                
                <div className="flex flex-col items-center justify-start my-5 mx-auto gap-2 bg-verde/50 md:max-w-2xl rounded-2xl">

                    <div className='bg-verde-escuro text-white font-bold text-left w-full pl-6 py-2 rounded-t-2xl h-3' />
                        

                    <div>
                        <CardEntrevistador id={0} />
                        <CardEntrevistador id={1}/>
                        <CardEntrevistador id={2}/>
                    </div>
                    
                </div>                

            </div>         
        
        </div>
                
        </>
    )
}

export default Entrevistadores