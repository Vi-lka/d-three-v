"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { AlertCircle, FileType, Upload } from "lucide-react"
import { Label } from "@/shared/components/ui/label"
import { Input } from "@/shared/components/ui/input"
import { Textarea } from "@/shared/components/ui/textarea"
import { Button } from "@/shared/components/ui/button"
import { api } from "@/shared/api/trpc/react"
import { Alert, AlertDescription } from "@/shared/components/ui/alert"
import { useSession } from "next-auth/react"
import { uploadFile } from "@/shared/lib/uploadFile";
import { formatFileSize } from "@/shared/lib/utils"

interface ModelUploadFormProps {
  onUploadComplete?: (modelId: string) => void
}

export function ModelUploadForm({ onUploadComplete }: ModelUploadFormProps) {
  const session = useSession();
  const router = useRouter()
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    file: null as File | null,
  })

  const uploadModel = api.model.upload.useMutation({
    onSuccess: async (data) => {
      // Перенаправляем на страницу редактирования
      router.push(`/edit-model/${data.id}`)

      if (onUploadComplete) {
        onUploadComplete(data.id)
      }

        setError(null)
    },
    onError: (error) => {
      setError(error.message)
    }
  });

  const acceptedFormats = [".glb"]
  const maxFileSize = 50 * 1024 * 1024 // 50MB

  const validateFile = (file: File): string | null => {
    const extension = "." + file.name.split(".").pop()?.toLowerCase()

    if (!acceptedFormats.includes(extension)) {
      return `Неподдерживаемый формат. Поддерживаются: ${acceptedFormats.join(", ")}`
    }

    if (file.size > maxFileSize) {
      return "Файл слишком большой. Максимальный размер: 50MB"
    }

    return null
  }

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    setError(null)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      const file = files[0]!
      const validationError = validateFile(file)

      if (validationError) {
        setError(validationError)
        return
      }

      setFormData((prev) => ({ ...prev, file }))
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)
    const file = e.target.files?.[0]

    if (file) {
      const validationError = validateFile(file)

      if (validationError) {
        setError(validationError)
        return
      }

      setFormData((prev) => ({ ...prev, file }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.file || !formData.title.trim()) {
      setError("Пожалуйста, заполните все обязательные поля")
      return
    }

    if (!session.data) {
      setError("Пожалуйста, войдите в свой аккаунт")
      return
    }

    try {
      const genName = `${formData.title}-${crypto.randomUUID()}`;

      const fileResult = await uploadFile({
        file: formData.file,
        userId: session.data?.user.id, // Replace with actual user ID from auth
        path: genName,
      });

      uploadModel.mutate({
        name: genName,
        originalName: formData.title,
        description: formData.description,
        fileUrl: fileResult.url,
        fileSize: fileResult.size,
        imageUrl: null
      })
    } catch (error) {
      setError("Произошла ошибка при загрузке")
      console.error(error)
      return
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-6 w-6" />
          Загрузка 3D модели
        </CardTitle>
        <CardDescription>Загрузите вашу 3D модель для редактирования и настройки</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Поле названия */}
          <div className="space-y-2">
            <Label htmlFor="title">Название модели *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Введите название модели"
              disabled={uploadModel.isPending}
            />
          </div>

          {/* Поле описания */}
          <div className="space-y-2">
            <Label htmlFor="description">Описание</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Опишите вашу модель"
              rows={3}
              disabled={uploadModel.isPending}
            />
          </div>

          {/* Область загрузки файла */}
          <div className="space-y-2">
            <Label>Файл модели *</Label>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive ? "border-primary" : "border-border hover:border-accent"
              } ${uploadModel.isPending ? "opacity-50 pointer-events-none" : ""}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {formData.file ? (
                <div className="space-y-2">
                  <FileType className="h-12 w-12 mx-auto text-green-500 dark:text-green-600" />
                  <div className="font-medium">{formData.file.name}</div>
                  <div className="text-sm text-muted-foreground">{formatFileSize(formData.file.size)}</div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setFormData((prev) => ({ ...prev, file: null }))}
                    disabled={uploadModel.isPending}
                  >
                    Выбрать другой файл
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                  <div>
                    <div className="font-medium">Перетащите файл сюда или</div>
                    <Button type="button" variant="outline" className="mt-2 bg-transparent" disabled={uploadModel.isPending}>
                      <label htmlFor="file-upload" className="cursor-pointer">
                        Выберите файл
                      </label>
                    </Button>
                    <input
                      id="file-upload"
                      type="file"
                      accept={acceptedFormats.join(",")}
                      onChange={handleFileSelect}
                      className="hidden"
                      disabled={uploadModel.isPending}
                    />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Поддерживаемые форматы: {acceptedFormats.join(", ")}
                    <br />
                    Максимальный размер: 50MB
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Ошибки */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Кнопка отправки */}
          <Button type="submit" className="w-full" disabled={!formData.file || !formData.title.trim() || uploadModel.isPending}>
            {uploadModel.isPending ? "Загрузка..." : "Загрузить и перейти к редактированию"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
