function Log() {
    return (target: any, name: string, desc: PropertyDescriptor) => {
        const origin = desc.value
        desc.value = function (...args : any[]) {
            return origin.apply(this, args)
        }
    }
}

function TimeLine() {
    return function (constructor: any) {
        Object.defineProperty(constructor.prototype, "date" , {
            get () {
                return new Date()
            },
            set(v) {
                throw new Error("Readonly property can not be updated")
            }
        })
    }
}

function Measure(measurer?: ((comment: string) => void), comment?: string) {
    return function (target: any, name: string , desc: PropertyDescriptor) {
        const original = desc.value
        desc.value = function (...args: any[]) {
            const d = new Date().getTime()
            console.log(this)
            const res = original.apply(this, args)
            const xtime = new Date().getTime() - d

            const result = `Returned : ${res}`
            const text = `Execution time has been ${xtime}ms\n${result}`
            if(measurer) measurer(typeof comment !== "undefined" ? `${comment}${result}` : text)
            else console.log(text)

            return original.apply(this, args)
        }
    }
}

@TimeLine()
class Time {
    readonly type: string
    date: Date

    constructor(type : string) {
        this.type = type
    }

    @Log()
    @Measure(function(){}, "")
    time() {
        for(let i = -1; i < 100000000; i++);
        return this.date.getTime()
    }
}

const date = new Time("DATE")

console.log(date.time())