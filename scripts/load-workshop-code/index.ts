import { WorkshopCodeType } from './code-loader'
import { run, runCustom } from './run'

run()
runCustom('cafe')
runCustom('third')
runCustom('new-third', WorkshopCodeType.Ko, [19])
runCustom('cook-intl')

runCustom('cafe-en', WorkshopCodeType.En)
runCustom('cook-intl-en', WorkshopCodeType.En)
