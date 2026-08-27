import type { GoogleProfile } from '../../modules/auth/types/auth'

interface ProfileAvatarProps {
  profile: GoogleProfile
  size?: 'normal' | 'large'
}

/** Displays a Google profile image or an initial fallback. */
export const ProfileAvatar = ({ profile, size = 'normal' }: ProfileAvatarProps) => {
  const sizeClasses = size === 'large' ? 'size-[54px] text-[17px]' : 'size-8 text-xs'

  if (profile.picture) {
    return (
      <img
        className={`${sizeClasses} rounded-full border border-mint-line bg-mint object-cover`}
        src={profile.picture}
        alt=""
      />
    )
  }

  return (
    <span
      className={`grid ${sizeClasses} place-items-center rounded-full border border-mint-line bg-mint font-bold text-teal`}
      aria-hidden="true"
    >
      {profile.name.slice(0, 1).toUpperCase()}
    </span>
  )
}
