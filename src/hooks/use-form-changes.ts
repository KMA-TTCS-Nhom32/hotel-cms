import { useEffect, useState, useRef } from 'react'
import { UseFormReturn, useWatch } from 'react-hook-form'

/**
 * Simple deep equality check for objects and arrays
 */
function isEqual(a: any, b: any): boolean {
  // Handle primitives
  if (a === b) return true
  
  // If either is null/undefined and the other isn't
  if (a == null || b == null) return false
  
  // If types don't match
  if (typeof a !== typeof b) return false
  
  // Handle arrays
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false
    
    for (let i = 0; i < a.length; i++) {
      if (!isEqual(a[i], b[i])) return false
    }
    
    return true
  }
  
  // Handle objects (but not null, which typeof reports as 'object')
  if (typeof a === 'object' && a !== null && b !== null) {
    const keysA = Object.keys(a)
    const keysB = Object.keys(b)
    
    if (keysA.length !== keysB.length) return false
    
    for (const key of keysA) {
      if (!Object.prototype.hasOwnProperty.call(b, key)) return false
      if (!isEqual(a[key], b[key])) return false
    }
    
    return true
  }
  
  return false
}

/**
 * Custom hook to track if a form has been changed compared to its initial values
 * 
 * @param form - The react-hook-form useForm return object
 * @param initialData - The initial data to compare against
 * @returns An object containing hasChanges flag
 */
function useFormChanges<
  TFormValues extends Record<string, any>, 
  TData extends Record<string, any>
>(
  form: UseFormReturn<TFormValues>,
  initialData: TData | null
) {
  const [hasChanges, setHasChanges] = useState(false)
  const initialDataRef = useRef(initialData)
  
  // Use useWatch instead of form.watch() for better performance
  const formValues = useWatch({ control: form.control })

  useEffect(() => {
    // If there's no initial data, assume we're creating a new item
    if (!initialDataRef.current) {
      // For creation forms, check if required fields have values
      const hasRequiredValues = Object.values(formValues).some(
        value => {
          if (Array.isArray(value)) {
            return value.length > 0
          }
          return value !== undefined && value !== '' && value !== null
        }
      )
      setHasChanges(hasRequiredValues)
      return
    }

    // For update forms, compare current values with initial values
    const currentValues = { ...formValues }
    const initialValues = { ...initialDataRef.current }

    // Special handling for file inputs like icon first
    // If icon exists in form values, it means it was changed
    if (currentValues.icon instanceof File) {
      setHasChanges(true)
      return
    }

    // Process array fields to ensure proper comparison
    if (Array.isArray(currentValues.translations) && Array.isArray(initialValues.translations)) {
      // Only proceed with translation comparison if both arrays exist
      
      // First check if lengths differ
      if (currentValues.translations.length !== initialValues.translations.length) {
        setHasChanges(true)
        return
      }
      
      // Check for empty or incomplete translations
      const hasEmptyTranslations = currentValues.translations.some(
        trans => !trans.language || !trans.name
      )
      
      if (hasEmptyTranslations) {
        // Don't enable submit button if there are empty translations
        setHasChanges(false)
        return
      }

      // Deep comparison for array items
      try {
        // Sort both arrays to ensure consistent comparison regardless of order
        const sortedCurrentTranslations = [...currentValues.translations]
          .filter(t => t.language && t.name) // Ignore incomplete translations
          .sort((a, b) => (a.language || '').localeCompare(b.language || ''))
        
        const sortedInitialTranslations = [...initialValues.translations]
          .filter(t => t.language && t.name) // Ignore incomplete translations
          .sort((a, b) => (a.language || '').localeCompare(b.language || ''))

        const translationsChanged = !isEqual(
          sortedCurrentTranslations,
          sortedInitialTranslations
        )

        if (translationsChanged) {
          setHasChanges(true)
          return
        }
      } catch (error) {
        console.error("Error comparing translations:", error)
      }
    }

    // Compare other fields
    const fieldsToCompare = Object.keys(initialValues).filter(
      key => key !== 'translations' && key !== 'icon'
    )

    const hasFieldChanges = fieldsToCompare.some(
      key => !isEqual(currentValues[key], initialValues[key])
    )
    
    setHasChanges(hasFieldChanges)
  }, [formValues, initialData])

  // Debug logging for development environment
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.debug('[useFormChanges]', {
        hasChanges,
        isDirty: form.formState.isDirty,
        formValues,
        initialValues: initialDataRef.current
      })
    }
  }, [hasChanges, form.formState.isDirty, formValues])

  return { hasChanges }
}

export default useFormChanges
