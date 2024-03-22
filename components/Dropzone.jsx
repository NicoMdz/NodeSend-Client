import { useCallback, useContext } from "react"
import { useDropzone } from "react-dropzone"
import clienteAxios from "@/config/axios"
import appContext from "@/context/app/appContext"
import authContext from "@/context/auth/authContext"
import Formulario from "./Formulario"


const Dropzone = () => {

  const AppContext = useContext(appContext)
  const { cargando, mostrarAlerta, subirArchivo, crearEnlace } = AppContext

  const AuthContext = useContext(authContext)
  const { usuario, autenticado } = AuthContext

  const onDropRejected = () => {
    mostrarAlerta("El límite es 1MB, obtén una cuenta para poder subir archivos más grandes")
  }

  const onDropAccepted = useCallback( async (acceptedFiles) => {

    //Crear un form Data
    const formData = new FormData()
    formData.append("archivo", acceptedFiles[0])

    subirArchivo(formData, acceptedFiles[0].path)
1  }, [])
  
  //Extrar contenido de Dropzone
  const {getRootProps, getInputProps, isDragActive, acceptedFiles}  = useDropzone({onDropAccepted, onDropRejected, maxSize: 1000000}) //En bytes

  const archivos = acceptedFiles.map( archivo => (
    <li key={archivo.lastModified} className="bg-white flex-1 p-3 mb-4 shadow-lg rounded">
        <p className="font-bold text-xl">{archivo.path}</p>
        <p className="text-sm text-gray-500">{(archivo.size / Math.pow(1024,2)).toFixed(2)} MB</p>
    </li>
  ))



  return (

    <div className="md:flex-1 mb-3 mx-4 mt-16 lg:mt-0 flex flex-col items-center justify-center border-dashed border-gray-400 border-2 bg-gray-100 px-4">
        { acceptedFiles.length > 0 ? (
            <div className="mt-10 w-full">
                <h4 className="text-2xl font-bold text-center mb4-">Archivos</h4>
                <ul>
                {archivos}
                </ul>
                
                { autenticado ? <Formulario /> : null}

                {cargando ? (
                          <div className="flex justify-center mt-20">
                          <div className=" border-black h-20 w-20 animate-spin rounded-full border-8 border-t-red-600" />
                        </div>
                ) : (
                    <button type="button" className="bg-red-600 w-full py-3 rounded-lg text-white my-10 hover:bg-red-700" onClick={ () => crearEnlace()}>Crear Enlace</button>
                )}

            </div>
        ) : (
            <div {...getRootProps({ className: "dropzone w-full py-32"})}>
            <input className="h-100" {...getInputProps()} /> 
                { isDragActive ? <p className="text-2xl text-center text-gray-600">Suelta el archivo</p> : 
                <div className="text-center">
                    <p className="text-2xl text-center text-gray-600">Seleccciona un arcchivo y arrástralo aquí</p>
                    <button className="bg-red-600 w-full py-3 rounded-lg text-white my-10 hover:bg-red-700"     type="button">Selecciona archivos para subir</button>                
                </div>
                }
        </div>            
        )}



     </div>
  )
}

export default Dropzone