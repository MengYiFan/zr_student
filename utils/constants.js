export const API_URI = 'http://192.168.0.103:9100/stg'
// export const API_URI = 'http://www.zredq.com:9100/stg'
// export const API_URI = 'https://app.shangnarxue.com/stg'

// INDEX
export const BANNER = API_URI + '/none/banner'
export const USER_LOGON = API_URI + '/user/nonlogin/login'
export const RECOMMEND_TEACHER_LIST = API_URI + '/user/login/myTeacherList'
export const CUBJECT_LIST = API_URI + '/main/subjectList'
export const PUBLIC_COURSE_LIST = API_URI + '/course/publicCourseList'// 没有返回标签名称
export const VIDEO_LIST = API_URI + '/vedio/vedioList'

// course
export const MY_CONTENT_LIST = API_URI + '/column/parent/myContentList'
export const MY_COURSE_LIST = API_URI + '/course/parent/myCourseList'
export const MY_VEDIO_LIST = API_URI + '/vedio/parent/myVedioList'

// teacher
export const TEACHER_DETAIL = API_URI + '/teacher/info/teacherDetail'
export const IS_ONLINE = API_URI + '/consult/isonline'
export const HELP_ASSIGN = API_URI + '/consult/assign'
export const ASSIGN_LINK = API_URI + '/assign/link'
export const TEACHER_COLUMN_SUBSCRIBE = API_URI + '/column/columnSubscribe'

// help
export const CATEGORY_AGE = API_URI + '/consult/category/age'
export const CATEGORY_QUS = API_URI + '/consult/category/question'
export const PAY_HELP_QUS = API_URI + '/consult/category-charge/question'

export const HELP_CALL = API_URI + '/consult/call'
export const HELP_CALL_HANGUP = API_URI + '/consult/hangup'

export const PAY_VEDIO = API_URI + '/vedio/updateVedioDetail'
// self
// CATEGORY_QUS
export const SUBJECT_LIST = API_URI + '/user/login/mySubjectList'
export const UPDATE_SUBJECT = API_URI + '/user/login/updateMySubject'
export const WALLET_LOYALTY_INFO = API_URI + '/user/login/walletLoyaltyInfo'

// video play&letter
export const COURSE_DETAIL = API_URI + '/course/parent/courseDetail'

export const HANGUP_APPLY = API_URI + '/consult/hangup/apply'

//
export const VEDIO_LIVE = API_URI +  '/vedio/getLivePlayUrl'

// 评分
export const VEDIO_RANK = API_URI + '/vedio/parent/vedioRank'
export const CONTENT_BANK = API_URI + '/column/parent/contentRank'
export const COURSE_BANK = API_URI + '/course/parent/courseRank'

// SEARCH
export const LIST_CONTENT = API_URI + '/column/contentListBySubject'
export const LIST_VEDIO = API_URI + '/vedio/vedioTypeList'
export const SEARCH_CONTENT = API_URI + '/column/contentListByKeywords'
export const SEARCH_VEDIO = API_URI + '/vedio/vedioSearchList'

// v2
export const CALL_ALL = API_URI + '/consult/call-all'
export const GET_IM = API_URI + '/im/login'
export const POLLING_URI = API_URI + '/consult/connecting'
export const ENTER_ROOM = API_URI + '/rtcroom/pusher/enter'
export const ENTER_RTCROOM = API_URI + '/rtcroom'
export const EXIT_RTCROOM = API_URI + '/rtcroom/pusher/exit'
export const HEARTBEAT = API_URI + '/rtcroom/heartbeat'
// 付费求助
export const PAY_CALL_ALL = API_URI + '/consult/call-all-charge'
//
export const GET_PUSHER = API_URI + '/consult/getpushurl'

// pay
export const PAY_INIT = API_URI + '/payment/payInit'
export const PAY_QUERY = API_URI + '/payment/payQuery'
export const PAY_RESULT = API_URI + '/payment/payResult'
export const PAY_CLOSE = API_URI + '/payment/tradeClose'

export const WALLET_PAY_INIT = API_URI + '/user/createRechargeWalletOrder'

export const REWARD = API_URI + '/course/parent/courseTips'
//
export const PAY_VEDIO_INIT = API_URI + '/vedio/createVedioOrder'

export const ORDER_DETAIL = API_URI + '/order/orderDetail'

export const PHONE_VALIDATION_CODE = API_URI + '/none/sendcode'
export const BIND_USER = API_URI + '/user/login/bindingUser'


// !!!@@@
export const COURSE_LIST = API_URI + '/course/parent/myCourseList'

export const TEACHER_CONTENT_LIST = API_URI + '/teacher/column/teacherContentList'

export const ORDER_LIST = API_URI + '/order/orderList'
