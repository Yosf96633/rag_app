'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { FileWarningIcon, FileTextIcon } from 'lucide-react'

export default function Page() {
  const [pdf, setPdf] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [selectedAt, setSelectedAt] = useState<Date | null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) {
      setPdf(null)
      setError('Please select a file.')
      setSelectedAt(null)
      return
    }

    if (file.type !== 'application/pdf') {
      setPdf(null)
      setError('Only PDF files are allowed.')
      setSelectedAt(null)
      return
    }

    setPdf(file)
    setError(null)
    setSelectedAt(new Date())
  }

 const handleSubmit = async (event: React.FormEvent) => {
  event.preventDefault()

  if (!pdf) {
    setError('Please select a PDF file before submitting.')
    return
  }

  const formData = new FormData()
  formData.append("file", pdf)

  try {
    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || "Something went wrong during upload.")
    } else {
      console.log("✅ Upload success:", data)
      alert("Embedding stored successfully: " + data.count + " chunks")
    }
  } catch (err) {
    console.error(err)
    setError("Upload failed. Please try again.")
  }
}


  const formatBytes = (bytes: number) => {
    const units = ['Bytes', 'KB', 'MB', 'GB']
    let i = 0
    while (bytes >= 1024 && i < units.length - 1) {
      bytes /= 1024
      i++
    }
    return `${bytes.toFixed(1)} ${units[i]}`
  }
 
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl sm:text-3xl font-bold text-center">
            Upload PDF to Generate Embeddings
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="pdf-upload">Select PDF File</Label>
              <Input
                id="pdf-upload"
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
              />
              {error && (
                <Alert variant="destructive" className="mt-2">
                  <FileWarningIcon className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>

            {pdf && (
              <div className="mt-6 border rounded-lg p-4 bg-muted/50 space-y-2">
                <div className="flex items-center gap-2 font-medium text-primary">
                  <FileTextIcon className="h-5 w-5" />
                  PDF file selected
                </div>
                <p><span className="font-semibold">Name:</span> {pdf.name}</p>
                <p><span className="font-semibold">Size:</span> {formatBytes(pdf.size)}</p>
                {selectedAt && (
                  <p><span className="font-semibold">Selected At:</span> {selectedAt.toLocaleString()}</p>
                )}
              </div>
            )}

            <Button type="submit" className="w-full">
              Upload & Generate
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
