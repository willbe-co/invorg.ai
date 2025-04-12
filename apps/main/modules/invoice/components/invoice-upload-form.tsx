"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, X, CheckCircle, AlertCircle, FileIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import Image from "next/image"

type FileStatus = "idle" | "uploading" | "success" | "error"

interface FileWithStatus {
  file: File
  id: string
  status: FileStatus
  progress: number
  url?: string
  error?: string
}

interface FileUploadProps {
  folder?: string
  maxFiles?: number
  maxSize?: number // in bytes
  onUploadComplete?: (urls: string[]) => void
}

export function InvoiceUploadForm({
  folder = "",
  maxFiles = 10,
  maxSize = 10 * 1024 * 1024, // 10MB default
  onUploadComplete,
}: FileUploadProps) {
  const [files, setFiles] = useState<FileWithStatus[]>([])
  const [folderName, setFolderName] = useState(folder)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = acceptedFiles.map((file) => ({
        file,
        id: Math.random().toString(36).substring(2, 9),
        status: "idle" as FileStatus,
        progress: 0,
      }))

      setFiles((prev) => [...prev, ...newFiles].slice(0, maxFiles))
    },
    [maxFiles],
  )

  const router = useRouter()

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    maxFiles,
    maxSize,
    multiple: true,
  })

  const uploadFile = async (fileWithStatus: FileWithStatus) => {
    const { file, id } = fileWithStatus

    // Update status to uploading
    setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, status: "uploading" as FileStatus } : f)))

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("folder", folderName)

      const xhr = new XMLHttpRequest()

      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100)
          setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, progress } : f)))
        }
      })

      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const response = JSON.parse(xhr.responseText)
          setFiles((prev) =>
            prev.map((f) =>
              f.id === id
                ? {
                  ...f,
                  status: "success",
                  progress: 100,
                  url: response.url,
                }
                : f,
            ),
          )
          router.refresh()
          console.log(response)
        } else {
          setFiles((prev) =>
            prev.map((f) =>
              f.id === id
                ? {
                  ...f,
                  status: "error",
                  error: "Upload failed",
                }
                : f,
            ),
          )
        }
      })

      xhr.addEventListener("error", () => {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === id
              ? {
                ...f,
                status: "error",
                error: "Network error",
              }
              : f,
          ),
        )
      })

      xhr.open("POST", "/api/upload")
      xhr.send(formData)
    } catch (error) {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === id
            ? {
              ...f,
              status: "error",
              error: "Upload failed",
            }
            : f,
        ),
      )
    }
  }

  const uploadAllFiles = () => {
    const idleFiles = files.filter((f) => f.status === "idle")
    idleFiles.forEach(uploadFile)
  }

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id))
  }

  const getSuccessfulUploads = () => {
    return files.filter((f) => f.status === "success" && f.url).map((f) => f.url as string)
  }

  const handleUploadComplete = () => {
    if (onUploadComplete) {
      onUploadComplete(getSuccessfulUploads())
    }
  }

  const isImage = (file: File) => {
    return file.type.startsWith("image/")
  }

  return (
    <div className="w-full mx-auto space-y-4">
      {/* <div className="space-y-2"> */}
      {/*   <Label htmlFor="folder">Folder (optional)</Label> */}
      {/*   <Input */}
      {/*     id="folder" */}
      {/*     placeholder="Enter folder name (e.g., images)" */}
      {/*     value={folderName} */}
      {/*     onChange={(e) => setFolderName(e.target.value)} */}
      {/*   /> */}
      {/* </div> */}

      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? "border-primary bg-primary/10" : "border-muted-foreground/25"}
          ${isDragReject ? "border-destructive bg-destructive/10" : ""}
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center gap-2">
          <Upload className="h-10 w-10 text-muted-foreground" />
          <h3 className="text-lg font-medium">{isDragActive ? "Largue aqui os ficheiros" : "Arraste e largue aqui os ficheiros"}</h3>
          <p className="text-sm text-muted-foreground">ou click para selecionar as imagens</p>
          <p className="text-xs text-muted-foreground mt-2">
            Máximo de {maxFiles} ficheiros, até {(maxSize / (1024 * 1024)).toFixed(0)}MB cada
          </p>
        </div>
      </div>


      {files.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Ficheiros ({files.length})</h3>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFiles([])}
                disabled={files.some((f) => f.status === "uploading")}
              >
                Limpar tudo
              </Button>
              <Button
                size="sm"
                onClick={uploadAllFiles}
                disabled={!files.some((f) => f.status === "idle") || files.some((f) => f.status === "uploading")}
              >
                Upload tudo
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {files.map((fileWithStatus) => (
              <Card key={fileWithStatus.id} className="overflow-hidden py-0">
                <CardContent className="p-4">
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between overflow-hidden gap-4">
                      {isImage(fileWithStatus.file) ? (
                        <div className="bg-muted relative h-full w-full max-w-40 aspect-[4/3]">
                          <Image
                            src={fileWithStatus.url || URL.createObjectURL(fileWithStatus.file)}
                            alt={fileWithStatus.file.name}
                            className="object-contain"
                            fill
                          />
                        </div>
                      ) : (
                        <FileIcon className="h-6 w-6 text-muted-foreground" />
                      )}
                      {fileWithStatus.status === "idle" && (
                        <div className="">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs"
                            onClick={() => uploadFile(fileWithStatus)}
                          >
                            Upload
                          </Button>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0 max-w-full w-full">
                      <div className="flex justify-between items-start">
                        <div className="truncate pr-4">
                          <p className="text-sm font-medium truncate">{fileWithStatus.file.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {(fileWithStatus.file.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {fileWithStatus.status === "success" && <CheckCircle className="h-5 w-5 text-green-500" />}
                          {fileWithStatus.status === "error" && <AlertCircle className="h-5 w-5 text-destructive" />}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => removeFile(fileWithStatus.id)}
                            disabled={fileWithStatus.status === "uploading"}
                          >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Remover</span>
                          </Button>
                        </div>
                      </div>

                      {fileWithStatus.status === "uploading" && (
                        <div className="mt-2">
                          <Progress value={fileWithStatus.progress} className="h-1" />
                          <p className="text-xs text-muted-foreground mt-1">{fileWithStatus.progress}%</p>
                        </div>
                      )}


                      {/* {fileWithStatus.status === "success" && ( */}
                      {/*   <p className="text-xs text-muted-foreground mt-1 truncate">{fileWithStatus.url}</p> */}
                      {/* )} */}

                      {fileWithStatus.status === "error" && (
                        <p className="text-xs text-destructive mt-1">{fileWithStatus.error || "Upload falhou"}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* {files.some((f) => f.status === "success") && <Button onClick={handleUploadComplete}>Completo</Button>} */}
        </div>
      )}
    </div>
  )
}
