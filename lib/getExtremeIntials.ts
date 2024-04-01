export default function getExtremeInitials(name: string) : string {
    let nameParts = name.split(" ");
    let initials = nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0);
    return initials.toUpperCase();
}
