import { expect, test } from '@playwright/test'
import { generateId, PlatformSetting, PlatformURI } from '../utils'
import { allure } from 'allure-playwright'
import { LeftSideMenuPage } from '../model/left-side-menu-page'
import { TrackerNavigationMenuPage } from '../model/tracker/tracker-navigation-menu-page'
import { MilestonesPage } from '../model/tracker/milestones-page'
import { NewMilestone } from '../model/tracker/types'
import { MilestonesDetailsPage } from '../model/tracker/milestones-details-page'

test.use({
  storageState: PlatformSetting
})

test.describe('Tracker milestone tests', () => {
  test.beforeEach(async ({ page }) => {
    await allure.parentSuite('Tracker tests')
    await (await page.goto(`${PlatformURI}/workbench/sanity-ws`))?.finished()
  })

  test('Create a Milestone', async ({ page }) => {
    const newMilestone: NewMilestone = {
      name: `Created Milestone-${generateId()}`,
      description: 'Create a Milestone',
      status: 'In progress',
      targetDateInDays: 'in 3 days'
    }

    const leftSideMenuPage = new LeftSideMenuPage(page)
    await leftSideMenuPage.buttonTracker.click()

    const trackerNavigationMenuPage = new TrackerNavigationMenuPage(page)
    await trackerNavigationMenuPage.openMilestonesForProject('Default')

    const milestonesPage = new MilestonesPage(page)
    await milestonesPage.createNewMilestone(newMilestone)
    await milestonesPage.openMilestoneByName(newMilestone.name)

    const milestonesDetailsPage = new MilestonesDetailsPage(page)
    await expect(milestonesDetailsPage.inputTitle).toHaveValue(newMilestone.name)
  })
})