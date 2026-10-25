import { useState, useEffect, useRef, useMemo } from 'react'
import type { Country } from 'react-phone-number-input'
import { getCountries, getCountryCallingCode } from 'react-phone-number-input'
import flags from 'react-phone-number-input/flags'
import en from 'react-phone-number-input/locale/en.json'
import { AsYouType } from 'libphonenumber-js'

export interface PhoneInputFieldProps {
  id?: string
  value?: string
  onChange?: (value: string) => void
  disabled?: boolean
  error?: string
  defaultCountry?: Country
  className?: string
}

const countryNames = en as Record<string, string>

// Popular countries prioritized at the top of the selector
const POPULAR_COUNTRIES: Country[] = ['US', 'EG', 'SA', 'AE', 'GB', 'CA', 'DE', 'FR']

export function PhoneInputField({
  id = 'phoneInput',
  value = '',
  onChange,
  disabled = false,
  error,
  defaultCountry = 'US',
  className = '',
}: PhoneInputFieldProps) {
  const [selectedCountry, setSelectedCountry] = useState<Country>(defaultCountry)
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [nationalNumber, setNationalNumber] = useState('')
  const [prevValue, setPrevValue] = useState(value)

  // Adjust state during render when external prop changes (React recommended pattern)
  if (value !== prevValue) {
    setPrevValue(value)
    if (value) {
      let code: string
      try {
        code = getCountryCallingCode(selectedCountry)
      } catch {
        code = ''
      }
      if (code && value.startsWith(`+${code}`)) {
        const raw = value.slice(`+${code}`.length).trim()
        const formatter = new AsYouType(selectedCountry)
        setNationalNumber(formatter.input(raw))
      } else {
        const formatter = new AsYouType(selectedCountry)
        setNationalNumber(formatter.input(value))
      }
    } else {
      setNationalNumber('')
    }
  }

  const dropdownRef = useRef<HTMLDivElement | null>(null)
  const searchInputRef = useRef<HTMLInputElement | null>(null)
  const phoneInputRef = useRef<HTMLInputElement | null>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      // Auto-focus search input when opening
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 50)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // All countries list with metadata
  const allCountries = useMemo(() => {
    const list = getCountries()
    return list.map((code) => {
      let callingCode: string
      try {
        callingCode = getCountryCallingCode(code)
      } catch {
        callingCode = ''
      }
      return {
        code,
        name: countryNames[code] || code,
        callingCode,
      }
    })
  }, [])

  // Filtered countries based on search
  const filteredCountries = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) {
      // Split into popular and remaining
      const popular = POPULAR_COUNTRIES.map((code) =>
        allCountries.find((c) => c.code === code)
      ).filter(Boolean) as typeof allCountries
      const rest = allCountries.filter((c) => !POPULAR_COUNTRIES.includes(c.code))
      return { popular, rest }
    }

    const matched = allCountries.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.code.toLowerCase().includes(query) ||
        c.callingCode.includes(query)
    )
    return { popular: [], rest: matched }
  }, [allCountries, searchQuery])

  // Handle phone number input
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value
    const formatter = new AsYouType(selectedCountry)
    const formatted = formatter.input(rawValue)
    setNationalNumber(formatted)

    if (onChange) {
      const callingCode = getCountryCallingCode(selectedCountry)
      // Provide full formatted international value if input exists
      const cleanDigits = rawValue.replace(/\D/g, '')
      if (cleanDigits) {
        onChange(`+${callingCode} ${formatted}`)
      } else {
        onChange('')
      }
    }
  }

  // Handle country selection
  const handleSelectCountry = (country: Country) => {
    setSelectedCountry(country)
    setIsOpen(false)
    setSearchQuery('')

    // Reformat existing number under new country
    const raw = nationalNumber.replace(/\D/g, '')
    const formatter = new AsYouType(country)
    const reformatted = formatter.input(raw)
    setNationalNumber(reformatted)

    if (onChange) {
      const callingCode = getCountryCallingCode(country)
      if (raw) {
        onChange(`+${callingCode} ${reformatted}`)
      }
    }

    phoneInputRef.current?.focus()
  }

  // Clear phone input
  const handleClear = () => {
    setNationalNumber('')
    if (onChange) onChange('')
    phoneInputRef.current?.focus()
  }

  // Get selected flag SVG component
  const SelectedFlag = flags[selectedCountry]
  const currentCallingCode = getCountryCallingCode(selectedCountry)

  return (
    <div className={`relative flex flex-col gap-1 ${className}`} ref={dropdownRef}>
      <div className="flex gap-space-xs items-center">
        {/* Country Code Selector Pill */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => setIsOpen(!isOpen)}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          className={`relative min-w-[130px] h-11 bg-surface-container-low rounded-lg shadow-xs flex items-center justify-between px-space-sm cursor-pointer hover:bg-surface-container transition-colors border border-outline-variant/30 select-none ${
            disabled ? 'opacity-60 cursor-not-allowed' : ''
          }`}
          title={`${countryNames[selectedCountry] || selectedCountry} (+${currentCallingCode})`}
        >
          <div className="flex items-center gap-space-xs overflow-hidden">
            {SelectedFlag && (
              <span className="w-5 h-3.5 flex items-center justify-center shrink-0 overflow-hidden rounded-[2px] shadow-xs">
                <SelectedFlag title={countryNames[selectedCountry] || selectedCountry} />
              </span>
            )}
            <span className="font-body-md text-body-md font-semibold text-on-surface whitespace-nowrap">
              +{currentCallingCode} {selectedCountry}
            </span>
          </div>
          <span
            className={`material-symbols-outlined text-[18px] text-on-surface-variant transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          >
            arrow_drop_down
          </span>
        </button>

        {/* Phone Number Input */}
        <div className="relative flex-1">
          <input
            id={id}
            ref={phoneInputRef}
            type="tel"
            autoComplete="tel-national"
            disabled={disabled}
            value={nationalNumber}
            onChange={handlePhoneChange}
            placeholder={selectedCountry === 'US' ? '(555) 234-8901' : 'Phone number'}
            className={`w-full h-11 pl-space-sm pr-9 bg-surface-container-lowest text-on-surface font-body-md text-body-md rounded-lg shadow-xs border transition-all outline-none ${
              error
                ? 'border-error bg-error-container/10 focus:ring-1 focus:ring-error'
                : 'border-outline-variant/40 focus:bg-surface-container-low focus:ring-1 focus:ring-primary'
            } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
          />

          {nationalNumber && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-outline-variant hover:text-on-surface transition-colors cursor-pointer"
              title="Clear phone number"
            >
              <span className="material-symbols-outlined text-[16px]">cancel</span>
            </button>
          )}
        </div>
      </div>

      {/* Floating Country Selector Dropdown */}
      {isOpen && (
        <div
          className="absolute top-12 left-0 w-80 max-h-80 bg-surface-container-lowest rounded-xl shadow-xl border border-outline-variant/30 z-50 flex flex-col overflow-hidden animate-fadeIn"
          role="listbox"
        >
          {/* Search Header */}
          <div className="p-2 border-b border-outline-variant/20 bg-surface-container-low sticky top-0 z-10">
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-2.5 text-on-surface-variant text-[18px]">
                search
              </span>
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search country or code..."
                className="w-full h-9 pl-9 pr-3 rounded-lg bg-surface-container-lowest border border-outline-variant/30 font-body-sm text-body-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 text-outline-variant hover:text-on-surface"
                >
                  <span className="material-symbols-outlined text-[16px]">cancel</span>
                </button>
              )}
            </div>
          </div>

          {/* Countries Scrollable List */}
          <div className="flex-1 overflow-y-auto p-1 divide-y divide-outline-variant/10">
            {/* Popular section */}
            {filteredCountries.popular.length > 0 && (
              <div className="pb-1 mb-1">
                <div className="px-3 py-1 font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                  Popular Countries
                </div>
                {filteredCountries.popular.map((item) => {
                  const ItemFlag = flags[item.code]
                  const isSelected = item.code === selectedCountry
                  return (
                    <button
                      key={`popular-${item.code}`}
                      type="button"
                      onClick={() => handleSelectCountry(item.code)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-primary-fixed text-primary font-semibold'
                          : 'hover:bg-surface-container text-on-surface'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        {ItemFlag && (
                          <span className="w-5 h-3.5 flex items-center justify-center shrink-0 overflow-hidden rounded-[2px] shadow-xs">
                            <ItemFlag title={item.name} />
                          </span>
                        )}
                        <span className="font-body-sm text-body-sm truncate">{item.name}</span>
                      </div>
                      <span className="font-body-sm text-body-sm text-on-surface-variant shrink-0 ml-2">
                        +{item.callingCode}
                      </span>
                    </button>
                  )
                })}
              </div>
            )}

            {/* Rest section */}
            <div>
              {filteredCountries.popular.length > 0 && (
                <div className="px-3 py-1 font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                  All Countries
                </div>
              )}
              {filteredCountries.rest.length > 0 ? (
                filteredCountries.rest.map((item) => {
                  const ItemFlag = flags[item.code]
                  const isSelected = item.code === selectedCountry
                  return (
                    <button
                      key={item.code}
                      type="button"
                      onClick={() => handleSelectCountry(item.code)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-primary-fixed text-primary font-semibold'
                          : 'hover:bg-surface-container text-on-surface'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        {ItemFlag && (
                          <span className="w-5 h-3.5 flex items-center justify-center shrink-0 overflow-hidden rounded-[2px] shadow-xs">
                            <ItemFlag title={item.name} />
                          </span>
                        )}
                        <span className="font-body-sm text-body-sm truncate">{item.name}</span>
                      </div>
                      <span className="font-body-sm text-body-sm text-on-surface-variant shrink-0 ml-2">
                        +{item.callingCode}
                      </span>
                    </button>
                  )
                })
              ) : (
                <div className="p-4 text-center text-on-surface-variant font-body-sm text-body-sm">
                  No countries found for &ldquo;{searchQuery}&rdquo;
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {error && (
        <span className="text-error font-body-sm text-body-sm flex items-center gap-1 mt-0.5">
          <span className="material-symbols-outlined text-[14px]">error</span>
          <span>{error}</span>
        </span>
      )}
    </div>
  )
}
