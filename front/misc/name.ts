function AnonymousNameConverter(name: string): string {
    return name[0] + "***"+ name[name.length-1]
}

export {
    AnonymousNameConverter
}