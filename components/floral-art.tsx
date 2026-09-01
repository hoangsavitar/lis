export function FloralArt({ className = "", decorative = false }: { className?: string; decorative?: boolean }) {
  return (
    <svg
      className={className}
      viewBox="0 0 360 460"
      fill="none"
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : "Minh họa hoa calla lily mềm mại"}
      aria-hidden={decorative ? true : undefined}
    >
      <defs>
        <linearGradient id="petalPink" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFF8F6" />
          <stop offset="0.48" stopColor="#F2A6AF" />
          <stop offset="1" stopColor="#CF6D7B" />
        </linearGradient>
        <linearGradient id="petalCream" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFFDFB" />
          <stop offset="1" stopColor="#E7B5B9" />
        </linearGradient>
        <linearGradient id="stemGreen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#A4C6B7" />
          <stop offset="1" stopColor="#5F8980" />
        </linearGradient>
      </defs>
      <g className="flower-sway">
        <path d="M182 443C179 342 181 250 190 153" stroke="url(#stemGreen)" strokeWidth="7" strokeLinecap="round" />
        <path d="M178 367C123 325 95 275 87 215C144 235 176 275 182 328" fill="#8FB3A5" opacity="0.82" />
        <path d="M188 304C241 270 273 227 285 168C229 188 196 229 186 276" fill="#A4C6B7" opacity="0.78" />
        <path d="M177 408C125 385 85 345 61 291C119 302 160 337 182 379" fill="#79A69A" opacity="0.66" />
        <path d="M187 237C177 205 178 164 197 128" stroke="#6F9D8F" strokeWidth="4" strokeLinecap="round" />
        <path d="M193 148C166 125 163 87 183 55C196 33 220 26 247 34C246 73 232 101 207 116C205 131 201 141 193 148Z" fill="url(#petalPink)" />
        <path d="M198 129C218 106 224 75 220 42C246 56 255 86 244 113C235 135 219 147 198 151C194 144 194 136 198 129Z" fill="url(#petalCream)" opacity="0.92" />
        <path d="M185 226C158 205 151 172 163 142C173 119 193 107 218 108C221 144 211 178 190 201C190 213 189 220 185 226Z" fill="url(#petalPink)" opacity="0.93" />
        <path d="M189 211C201 183 204 152 197 113C226 126 237 152 230 179C225 200 211 216 190 225C187 220 187 216 189 211Z" fill="url(#petalCream)" opacity="0.88" />
        <path d="M188 324C160 303 154 272 165 245C174 224 193 213 218 214C219 249 209 278 191 299C192 309 191 318 188 324Z" fill="url(#petalPink)" opacity="0.78" />
        <path d="M191 311C203 285 204 257 198 218C224 231 234 254 228 278C223 298 210 312 192 321C189 318 189 315 191 311Z" fill="url(#petalCream)" opacity="0.72" />
      </g>
      <g className="petal-drift">
        <path d="M53 105C32 93 28 75 42 60C61 72 66 87 53 105Z" fill="#E9A5AE" opacity="0.7" />
      </g>
      <g className="petal-drift">
        <path d="M299 106C282 95 282 79 296 70C311 82 312 96 299 106Z" fill="#F2B6BC" opacity="0.65" />
      </g>
      <g className="petal-drift">
        <path d="M79 160C65 153 62 141 71 132C84 140 87 150 79 160Z" fill="#F0C3C7" opacity="0.72" />
      </g>
    </svg>
  );
}
