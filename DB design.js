// Find all the topics and tasks taught in the month of October

db.getCollection('topics').aggregate([
    {
        $lookup: {
            from: 'tasks',
            localField: 'topic',
            foreignField: 'task',
            as: 'Topic Task Data'
        }
    },
    {
        $match: {
            topicDate: { $regex: '2020-10' }
        }
    },
    {
        $project: {
            _id: 0,
            topic: 1,
            topicDate: 1,
            'Topic Task Data.userId': 1,
            'Topic Task Data.submitted': 1,
            'Topic Task Data.task': 1
        }
    }
], { maxTimeMS: 60000, allowDiskUse: true });

// Find all the company drives which appeared between 15 oct-2020 and 31-oct-2020

db.getCollection('company_drives').find({
    driveDate: { $gte: '2020-10-15', $lte: '2020-10-31' }
});

// Find all the company drives and students who appeared for placement

db.getCollection('Company_Drives').aggregate([
    {
        $lookup: {
            from: 'Users',
            localField: 'userId',
            foreignField: 'userId',
            as: 'studentInfo'
        }
    },
    {
        $project: {
            _id: 0,
            'studentInfo.userName': 1,
            company: 1,
            driveDate: 1,
            'studentInfo.userEmail': 1,
            'studentInfo.userId': 1
        }
    }
], { maxTimeMS: 60000, allowDiskUse: true });

// Find the number of problems solved by users in codekata

db.getCollection('codekata').aggregate([
    {
        $group: {
            _id: 'Total Problems Solved By Users',
            count: { $sum: '$problemSolved' }
        }
    }
], { maxTimeMS: 60000, allowDiskUse: true });

// Find all mentors with more than 15 mentees

db.getCollection('mentors').aggregate([
    { $match: { menteeCount: { $gt: 15 } } }
], { maxTimeMS: 60000, allowDiskUse: true });


// Find the number of users absent and tasks not submitted between 15 oct-2020 and 31-oct-2020

db.getCollection('attendance').aggregate([
    {
        $lookup: {
            from: 'topics',
            localField: 'topicId',
            foreignField: 'topicId',
            as: 'Absent'
        }
    },
    {
        $lookup: {
            from: 'tasks',
            localField: 'userId',
            foreignField: 'userId',
            as: 'Task-notSubmitted'
        }
    },
    {
        $unwind: '$Task-notSubmitted'
    },
    {
        $unwind: '$Absent'
    },
    {
        $match: {
            attended: false,
            'Absent.topicDate': {
                $gte: '2020-10-15',
                $lte: '2020-10-31'
            }
        }
    }
], { maxTimeMS: 60000, allowDiskUse: true });
























