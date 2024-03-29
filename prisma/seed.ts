
import { generateHash } from "../api/utils/hash";
import { prisma } from "../database/adapter";
import { getTimezoneDateUtcInMs } from "../timing/date";

async function main() {

    await prisma.$connect()

    await prisma.team.createMany({
        data: [
            {
                name: "فرسان البايت",
                about: "فريق يسعى للتميز والابداع في البرمجة",
                create_date_utc: `${getTimezoneDateUtcInMs(new Date('2021-03-20T00:00:00Z'), "Asia/Damascus")}`,
                creator_id: 2, // ahmad@gmail.com
                xp_points: 0,
                avatar: ''
            }
        ]
    })

    await prisma.team.createMany({
        data: [
            {
                name: "مبرمجين الشرق الأوسط",
                about: "الاول في الشرق الأوسط",
                create_date_utc: `${getTimezoneDateUtcInMs(new Date('2021-03-20T00:00:00Z'), "Asia/Damascus")}`,
                creator_id: 4, // adam@gmail.com
                xp_points: 0,
                avatar: ''
            }
        ]
    })

    await prisma.account.create({
        data: {
            email: "tarek@gmail.com",
            name: "طارق العوزة",
            about: "مهندس برمجيات",
            hash: generateHash('111'),
            join_date_utc: `${getTimezoneDateUtcInMs(new Date('2022-03-20T00:00:00Z'), "Asia/Damascus")}`,
            professions: ['Programming'],
            xp_points: 0,
            avatar: '',
            team_id: null
        }
    })

    await prisma.account.create({
        data: {
            email: "ahmad@gmail.com",
            name: "أحمد علي",
            about: "مهندس برمجيات",
            hash: generateHash('111'),
            join_date_utc: `${getTimezoneDateUtcInMs(new Date('2021-03-20T00:00:00Z'), "Asia/Damascus")}`,
            professions: ['Programming'],
            xp_points: 0,
            avatar: '',
            team_id: 1
        }
    })
    await prisma.account.create({
        data: {
            email: "abd@gmail.com",
            name: "عبد الرحمن",
            about: "مهندس برمجيات",
            hash: generateHash('111'),
            join_date_utc: `${getTimezoneDateUtcInMs(new Date('2021-03-20T00:00:00Z'), "Asia/Damascus")}`,
            professions: ['Programming'],
            xp_points: 0,
            avatar: '',
            team_id: 1
        }
    })
    
    await prisma.account.create({
        data: {
            email: "adam@gmail.com",
            name: "آدم محمود",
            about: "مهندس برمجيات",
            hash: generateHash('111'),
            join_date_utc: `${getTimezoneDateUtcInMs(new Date('2021-03-20T00:00:00Z'), "Asia/Damascus")}`,
            professions: ['Programming'],
            xp_points: 0,
            avatar: '',
            team_id: 2
        }
    })
    await prisma.account.create({
        data: {
            email: "mohammed@gmail.com",
            name: "محمد عبدو",
            about: "مهندس برمجيات",
            hash: generateHash('111'),
            join_date_utc: `${getTimezoneDateUtcInMs(new Date('2021-03-20T00:00:00Z'), "Asia/Damascus")}`,
            professions: ['Programming'],
            xp_points: 0,
            avatar: '',
            team_id: 2
        }
    })

    await prisma.event.create({
        data: 
            {
                name: "هاكاثون رمضان",
                description: "هاكاثون رمضان لعام 2024",
                start_date_utc: `${getTimezoneDateUtcInMs(new Date('2024-03-20T00:00:00Z'), "Asia/Damascus")}`,
                end_date_utc: `${getTimezoneDateUtcInMs(new Date('2024-03-29T00:00:00Z'), "Asia/Damascus")}`,
                field: 'Programming',
                finished: false,
                style: 'competetive',
                organizers: {
                    create: {
                        organizer_id: 1
                    }
                },
                participants: {
                    createMany: {
                        data: [
                            { 
                                team_id: 1,
                                join_date_utc: `${getTimezoneDateUtcInMs(new Date('2024-03-20T00:00:00Z'), "Asia/Damascus")}`
                            },
                            { 
                                team_id: 2,
                                join_date_utc: `${getTimezoneDateUtcInMs(new Date('2024-03-20T00:00:00Z'), "Asia/Damascus")}`
                            }
                        ]
                    }
                }
            }
    })

    await prisma.checkpoint.create({
        data: {
            checked: false,
            create_date_utc: `${getTimezoneDateUtcInMs(new Date('2024-03-20T00:00:00Z'), "Asia/Damascus")}`,
            title: "تقديم الفكرة",
            description: "تم تقديم الفكرة وارسالها للادارة",
            executors: {
                createMany: {
                    //     ahmad@gmail.com   abd@gmail.com
                    data: [{executor_id: 2}, {executor_id: 3}]
                }
            },
            team_id: 1,
            event_id: 1
        }
    })


    await prisma.checkpoint.create({
        data: {
            checked: false,
            create_date_utc: `${getTimezoneDateUtcInMs(new Date('2024-03-23T00:00:00Z'), "Asia/Damascus")}`,
            title: "نموذج اوّلي",
            description: "تم تسليم النموذج الاوّلي للادارة",
            executors: {
                createMany: {
                    //     ahmad@gmail.com   abd@gmail.com
                    data: [{executor_id: 2}, {executor_id: 3}]
                }
            },
            team_id: 1,
            event_id: 1
        }
    })


    await prisma.checkpoint.create({
        data: {
            checked: false,
            create_date_utc: `${getTimezoneDateUtcInMs(new Date('2024-03-25T00:00:00Z'), "Asia/Damascus")}`,
            title: "تسجيل تقدم 1",
            description: "تم تسجيل فيديو للانجازات الاولى في المشروع",
            executors: {
                createMany: {
                    //     ahmad@gmail.com   abd@gmail.com
                    data: [{executor_id: 2}, {executor_id: 3}]
                }
            },
            team_id: 1,
            event_id: 1
        }
    })


    await prisma.checkpoint.create({
        data: {
            checked: false,
            create_date_utc: `${getTimezoneDateUtcInMs(new Date('2024-03-27T00:00:00Z'), "Asia/Damascus")}`,
            title: "تسجيل تقدم 2",
            description: "تم تسجيل فيديو للانجازات  الثانية في المشروع",
            executors: {
                createMany: {
                    //     ahmad@gmail.com   abd@gmail.com
                    data: [{executor_id: 2}, {executor_id: 3}]
                }
            },
            team_id: 1,
            event_id: 1
        }
    })


    await prisma.checkpoint.create({
        data: {
            checked: false,
            create_date_utc: `${getTimezoneDateUtcInMs(new Date('2024-03-29T00:00:00Z'), "Asia/Damascus")}`,
            title: "تقديم العمل النهائي",
            description: "تم تسليم المشروع النهائي للادارة",
            executors: {
                createMany: {
                    //     ahmad@gmail.com   abd@gmail.com
                    data: [{executor_id: 2}, {executor_id: 3}]
                }
            },
            team_id: 1,
            event_id: 1
        }
    })

    

    await prisma.checkpoint.create({
        data: {
            checked: false,
            create_date_utc: `${getTimezoneDateUtcInMs(new Date('2024-03-20T00:00:00Z'), "Asia/Damascus")}`,
            title: "تسليم الفكرة",
            description: "تم تعبئة نموذج الفكرة للادارة",
            executors: {
                createMany: {
                    //     adam@gmail.com   mohammed@gmail.com
                    data: [{executor_id: 4}, {executor_id: 5}]
                }
            },
            team_id: 2,
            event_id: 1
        }
    })

    await prisma.checkpoint.create({
        data: {
            checked: false,
            create_date_utc: `${getTimezoneDateUtcInMs(new Date('2024-03-23T00:00:00Z'), "Asia/Damascus")}`,
            title: "تسليم النموذج 1",
            description: "ارسلنا النموذج الأوّلي واستعرضنا فيه التصميم",
            executors: {
                createMany: {
                    //     adam@gmail.com   mohammed@gmail.com
                    data: [{executor_id: 4}, {executor_id: 5}]
                }
            },
            team_id: 2,
            event_id: 1
        }
    })

    await prisma.checkpoint.create({
        data: {
            checked: false,
            create_date_utc: `${getTimezoneDateUtcInMs(new Date('2024-03-25T00:00:00Z'), "Asia/Damascus")}`,
            title: "تسليم نموذج 2",
            description: "ارسلنا فيديو رقم 2 للادارة للمراجعة الأولى",
            executors: {
                createMany: {
                    //     adam@gmail.com   mohammed@gmail.com
                    data: [{executor_id: 4}, {executor_id: 5}]
                }
            },
            team_id: 2,
            event_id: 1
        }
    })


    await prisma.checkpoint.create({
        data: {
            checked: false,
            create_date_utc: `${getTimezoneDateUtcInMs(new Date('2024-03-27T00:00:00Z'), "Asia/Damascus")}`,
            title: "تسليم نموذج 3",
            description: "ارسلنا فيديو رقم 3 للادارة للمراجعة الثانية",
            executors: {
                createMany: {
                    //     adam@gmail.com   mohammed@gmail.com
                    data: [{executor_id: 4}, {executor_id: 5}]
                }
            },
            team_id: 2,
            event_id: 1
        }
    })



    await prisma.checkpoint.create({
        data: {
            checked: false,
            create_date_utc: `${getTimezoneDateUtcInMs(new Date('2024-03-29T00:00:00Z'), "Asia/Damascus")}`,
            title: "تسليم النموذج النهائي",
            description: "تم تسليم اخر فيديو للادارة",
            executors: {
                createMany: {
                    //     adam@gmail.com   mohammed@gmail.com
                    data: [{executor_id: 4}, {executor_id: 5}]
                }
            },
            team_id: 2,
            event_id: 1
        }
    })


}



main().then( async () => {
    await prisma.$disconnect()
}).catch( async () => {
    await prisma.$disconnect() 
})