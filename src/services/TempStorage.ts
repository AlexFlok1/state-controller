export class TempStorage {

    private static storage: Storage

    public  static  instanceOf( variant: "localStorage" | "sessionStorage") {
        this.storage = variant === "localStorage" ? localStorage : sessionStorage
        return TempStorage
    }

    public static get(name: string){
        const item = this.storage.getItem(`sms:segemnt:${name}`);
        return item ? JSON.parse(item) : null;
    }

    public static set(name: string, value: Record<string, any> = {}){
        this.storage.setItem(`sms:segemnt:${name}`, JSON.stringify(value));
    }

}